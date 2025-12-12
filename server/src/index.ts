import { Server } from "socket.io"
import dotenv from "dotenv"
import {
    generateRandomCountryId,
    startNewRound,
    handlePlayerLeavingLobby,
    resetScores,
    createNewLobby,
} from "./utils.js"
import type { Lobbies } from "./types.js"

dotenv.config()

const PORT = Number(process.env.PORT) || 3000
const origin = process.env.BASE_FRONT_URL || "http://localhost:5173"

export const io = new Server({
    cors: {
        origin: origin,
        methods: ["GET", "POST"],
        credentials: true,
    },
})

export const lobbies: Lobbies = {}
export const roundDuration = 20 // gotta update client side too Quiz.tsx
export const defaultRoundLimit = 20 // gotta update client side too LobbyForm.tsx
const minRoundLimit = 5
const maxRoundLimit = 40
export const defaultRoundDelay = 3000
const fastRoundDelay = 1000
const maxScoreInOneGuess = 10

io.listen(PORT)

io.on("connection", (socket) => {
    console.log(`=====================`)
    console.log(`User ${socket.id} connected`)

    // Create Lobby
    socket.on("createLobby", () => {
        createNewLobby(socket)
    })

    // Request join lobby
    socket.on("requestLobbyAccess", (lobbyId: string) => {
        console.log(`User ${socket.id} requested to join lobby: ${lobbyId}`)
        const lobby = lobbies[lobbyId]
        if (lobby && !lobby.users.some((user) => user.uuid === socket.id)) {
            socket.emit("requestAccepted", {
                lobbyId,
                creator: lobby.creator,
            })
        } else {
            socket.emit("error", "Lobby introuvable")
        }
    })

    // Join Lobby
    socket.on("joinLobby", (lobbyId: string, username: string) => {
        if (
            !lobbies[lobbyId] ||
            lobbies[lobbyId].users.some((user) => user.uuid === socket.id)
        ) {
            createNewLobby(socket, lobbyId)
        }

        const lobby = lobbies[lobbyId]
        if (!lobby) return

        socket.join(lobbyId)
        lobby.users.push({
            uuid: socket.id,
            name: username,
            score: 0,
            hasGuessed: false,
        })
        io.to(lobbyId).emit("updateCreator", lobby.creator)
        console.log(`User ${socket.id} joined lobby ${lobbyId}`)

        // Update users list
        io.to(lobbyId).emit("updateUserList", lobby.users)
    })

    // Start game with preferred settings
    socket.on(
        "setupGame",
        ({ lobbyId, countriesList, roundLimit, fastmode }: {
            lobbyId: string
            countriesList: unknown[]
            roundLimit: number
            fastmode: boolean
        }) => {
            const lobby = lobbies[lobbyId]
            if (!lobby) return

            // Init round
            lobby.round = 1
            lobby.roundLimit = Math.min(
                Math.max(Number(roundLimit), minRoundLimit),
                maxRoundLimit
            )
            lobby.countriesList = countriesList
            lobby.lastCountriesId = []
            const countryId = generateRandomCountryId(
                countriesList.length,
                lobby.lastCountriesId
            )

            if (fastmode) {
                lobby.roundDelay = fastRoundDelay
            }

            // reset scores & variables
            lobby.playersWithGoodAnswer = []
            resetScores(lobbyId)
            io.to(lobbyId).emit("updateUserList", lobby.users)

            const targetDate = new Date(
                new Date().getTime() + roundDuration * 1000
            )
            lobby.targetDate = targetDate

            // Start game
            io.to(lobbyId).emit("startGame", {
                countriesList,
                countryId,
                targetDate,
            })
            console.log(`Lobby ${lobbyId} started the game`)
        }
    )

    socket.on("timerEnded", (lobbyId: string, playerId: string) => {
        const lobby = lobbies[lobbyId]
        if (!lobby || playerId !== lobby.creator) return
        const firstPlayer = lobby.playersWithGoodAnswer[0]

        io.to(lobbyId).emit(
            "endRound",
            firstPlayer ? firstPlayer.name : null,
            firstPlayer ? firstPlayer.guessTime : null
        )

        // Start new round
        setTimeout(() => {
            startNewRound(lobbyId, true)
        }, lobby.roundDelay)
    })

    socket.on("goodAnswer", (lobbyId: string, playerId: string) => {
        const lobby = lobbies[lobbyId]
        if (!lobby) return

        const player = lobby.users.find((user) => user.uuid === playerId)
        if (!player) return

        player.hasGuessed = true

        if (!lobby.targetDate) return
        let remainingTime =
            (lobby.targetDate.getTime() - new Date().getTime()) / 1000

        let guessTime = roundDuration - remainingTime
        guessTime = Math.trunc(guessTime * 100) / 100

        lobby.playersWithGoodAnswer.push({
            name: player.name,
            guessTime: guessTime,
        })

        // Calculate and update score
        let points = (remainingTime * maxScoreInOneGuess) / roundDuration
        points = Math.max(Math.round(points), 0)
        player.score += points

        io.to(lobbyId).emit("updateUserList", lobby.users, player)

        if (lobby.users.length === lobby.playersWithGoodAnswer.length) {
            const firstPlayer = lobby.playersWithGoodAnswer[0]
            if (firstPlayer) {
                io.to(lobbyId).emit(
                    "endRound",
                    firstPlayer.name,
                    firstPlayer.guessTime
                )
            }

            // Start new round
            setTimeout(() => {
                startNewRound(lobbyId, true)
            }, lobby.roundDelay)
        }
    })

    socket.on("newRound", (lobbyId: string) => {
        startNewRound(lobbyId, false)
    })

    socket.on("badAnswer", (lobbyId: string, answer: string) => {
        if (!lobbies[lobbyId]) return
        io.to(lobbyId).emit("wrongAnswer", answer)
    })

    // leave lobby
    socket.on("leaveLobby", (lobbyId: string, playerId: string) => {
        handlePlayerLeavingLobby(lobbyId, playerId)
    })

    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`)
        console.log(`=====================`)

        // Remove user from any lobbies they were in
        for (const lobbyId in lobbies) {
            handlePlayerLeavingLobby(lobbyId, socket.id)
        }
    })
})
