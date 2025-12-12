import {
    io,
    lobbies,
    roundDuration,
    defaultRoundLimit,
    defaultRoundDelay,
} from "./index.js"
import { v4 as uuidv4 } from "uuid"
import type { GameSocket, Player } from "./types.js"

export function resetScores(lobbyId: string): void {
    const lobby = lobbies[lobbyId]
    if (!lobby) return
    lobby.users.forEach((user: Player) => {
        user.score = 0
    })
}

function resetHasGuessed(lobbyId: string): void {
    const lobby = lobbies[lobbyId]
    if (!lobby) return
    lobby.users.forEach((user: Player) => (user.hasGuessed = false))
}

export function startNewRound(lobbyId: string, isNewRound: boolean): void {
    if (!lobbies[lobbyId]) return
    if (isNewRound) {
        lobbies[lobbyId].round = (lobbies[lobbyId].round ?? 0) + 1
    }
    resetHasGuessed(lobbyId)
    io.to(lobbyId).emit("updateUserList", lobbies[lobbyId].users)

    // Update values
    const roundCount = lobbies[lobbyId].round ?? 0
    if (roundCount <= lobbies[lobbyId].roundLimit) {
        // Start new Round
        const gamemode = Math.random() > 0.5 ? "findCountry" : "findCapital"
        const countryId = generateRandomCountryId(
            lobbies[lobbyId].countriesList?.length ?? 0,
            lobbies[lobbyId].lastCountriesId ?? []
        )

        // reset round variables
        lobbies[lobbyId].playersWithGoodAnswer = []

        lobbies[lobbyId].lastCountriesId?.push(countryId)

        const targetDate = new Date(new Date().getTime() + roundDuration * 1000)
        lobbies[lobbyId].targetDate = targetDate

        io.to(lobbyId).emit("startNewRound", {
            serverRoundCount: roundCount,
            countryId,
            gamemode,
            targetDate,
        })
    } else {
        // Game end
        io.to(lobbyId).emit("endGame")
    }
}

export function generateRandomCountryId(listLength: number, lastCountriesId: number[]): number {
    // Safeguard: reset if all countries have been used to prevent infinite loop
    if (lastCountriesId.length >= listLength) {
        lastCountriesId.length = 0
    }

    let newCountryId: number

    do {
        newCountryId = Math.round(Math.random() * (listLength - 1))
    } while (lastCountriesId.includes(newCountryId))

    return newCountryId
}

export function handlePlayerLeavingLobby(lobbyId: string, playerId: string): void {
    // Check if lobby exist
    if (lobbies[lobbyId]) {
        // Check if user is in it
        if (lobbies[lobbyId].users.some((user: Player) => user.uuid === playerId)) {
            // Remove user
            lobbies[lobbyId].users = lobbies[lobbyId].users.filter(
                (user: Player) => user.uuid !== playerId
            )
            console.log(`User ${playerId} has left the lobby: ${lobbyId}`)

            // Delete lobby if empty
            if (lobbies[lobbyId].users.length === 0) {
                console.log(`Lobby: ${lobbyId} was empty and got deleted`)
                delete lobbies[lobbyId]
                return
            }

            // Define new creator
            if (playerId === lobbies[lobbyId].creator) {
                // Get another user id
                const firstUser = lobbies[lobbyId].users[0]
                if (!firstUser) return
                const newCreator = firstUser.uuid
                console.log(
                    `Lobby: ${lobbyId} has a new creator: ${newCreator}`
                )

                // Update room creator
                lobbies[lobbyId].creator = newCreator
                io.to(lobbyId).emit("updateCreator", newCreator)
            }

            // Update users list
            io.to(lobbyId).emit("updateUserList", lobbies[lobbyId].users)
        }
    }
}

export function createNewLobby(socket: GameSocket, id?: string): void {
    const lobbyId = id ?? uuidv4()

    lobbies[lobbyId] = {
        users: [],
        creator: socket.id,
        roundLimit: defaultRoundLimit,
        playersWithGoodAnswer: [],
        targetDate: null,
        roundDelay: defaultRoundDelay,
    }

    // Emit back to the client
    socket.emit("lobbyCreated", { lobbyId, creator: socket.id })
    console.log(`User ${socket.id} created a new lobby: ${lobbyId}`)
}
