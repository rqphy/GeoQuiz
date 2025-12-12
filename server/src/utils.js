import {
    io,
    lobbies,
    roundDuration,
    defaultRoundLimit,
    defaultRoundDelay,
} from "./index.js"
import { v4 as uuidv4 } from "uuid"

export function resetScores(lobbyId) {
    lobbies[lobbyId].users.forEach((user) => {
        user.score = 0
    })
}

function resetHasGuessed(lobbyId) {
    lobbies[lobbyId].users.forEach((user) => (user.hasGuessed = false))
}

export function startNewRound(lobbyId, isNewRound) {
    if (!lobbies[lobbyId]) return
    if (isNewRound) {
        lobbies[lobbyId].round += 1
    }
    resetHasGuessed(lobbyId)
    io.to(lobbyId).emit("updateUserList", lobbies[lobbyId].users)

    // Update values
    const roundCount = lobbies[lobbyId].round
    if (roundCount <= lobbies[lobbyId].roundLimit) {
        // Start new Round
        const gamemode = Math.random() > 0.5 ? "findCountry" : "findCapital"
        const countryId = generateRandomCountryId(
            lobbies[lobbyId].countriesList.length,
            lobbies[lobbyId].lastCountriesId
        )

        // reset round variables
        lobbies[lobbyId].playersWithGoodAnswer = []

        lobbies[lobbyId].lastCountriesId.push(countryId)

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

export function generateRandomCountryId(listLength, lastCountriesId) {
    // Safeguard: reset if all countries have been used to prevent infinite loop
    if (lastCountriesId.length >= listLength) {
        lastCountriesId.length = 0
    }

    let newCountryId

    do {
        newCountryId = Math.round(Math.random() * (listLength - 1))
    } while (lastCountriesId.includes(newCountryId))

    return newCountryId
}

export function handlePlayerLeavingLobby(lobbyId, playerId) {
    // Check if lobby exist
    if (lobbies[lobbyId]) {
        // Check if user is in it
        if (lobbies[lobbyId].users.some((user) => user.uuid === playerId)) {
            // Remove user
            lobbies[lobbyId].users = lobbies[lobbyId].users.filter(
                (user) => user.uuid !== playerId
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
                const newCreator = lobbies[lobbyId].users[0].uuid
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

export function createNewLobby(socket, id) {
    let lobbyId = id ?? uuidv4()

    lobbies[lobbyId] = {
        users: [],
        creator: socket.id,
        roundLimit: defaultRoundLimit,
        playersWithGoodAnswer: [],
        targetDate: null,
        roundDelay: defaultRoundDelay,
    } // Init lobby with empty user

    // Emit back to the client
    socket.emit("lobbyCreated", { lobbyId, creator: socket.id })
    console.log(`User ${socket.id} created a new lobby: ${lobbyId}`)
}
