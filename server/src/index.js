import { Server } from "socket.io"
import { v4 as uuidv4 } from "uuid"
import dotenv from "dotenv"
import {
	generateRandomCountryId,
	startNewRound,
	handlePlayerLeavingLobby,
	resetScores,
} from "./utils.js"

dotenv.config()

const PORT = process.env.PORT || 3000

export const io = new Server({
	cors: {
		origin: process.env.BASE_FRONT_URL,
		methods: ["GET", "POST"],
		credentials: true, // Allow cookies or authentication headers
	},
})

export const lobbies = {}
export const roundDuration = 20 // gotta update client side too Quiz.tsx
const defaultRoundLimit = 5 // gotta update client side too
const minRoundLimit = 5
const maxRoundLimit = 40
const newRoundDelay = 3000

io.listen(PORT)

io.on("connection", (socket) => {
	console.log(`=====================`)
	console.log(`User ${socket.id} connected`)

	// Create Lobby
	socket.on("createLobby", () => {
		const lobbyId = uuidv4() // Generate unique lobby ID
		lobbies[lobbyId] = {
			users: [],
			creator: socket.id,
			roundLimit: defaultRoundLimit,
			playersWithGoodAnswer: [],
			targetDate: null,
		} // Init lobby with empty user

		// Emit back to the client
		socket.emit("lobbyCreated", { lobbyId, creator: socket.id })
		console.log(`User ${socket.id} created a new lobby: ${lobbyId}`)
	})

	// Request join lobby
	socket.on("requestLobbyAccess", (lobbyId) => {
		console.log(`User ${socket.id} requested to join lobby: ${lobbyId}`)
		if (
			lobbies[lobbyId] &&
			!lobbies[lobbyId].users.some((user) => user.uuid === socket.id)
		) {
			socket.emit("requestAccepted", {
				lobbyId,
				creator: lobbies[lobbyId].creator,
			})
		} else {
			socket.emit("error", "Lobby introuvable")
		}
	})

	// Join Lobby
	socket.on("joinLobby", (lobbyId, username) => {
		if (
			lobbies[lobbyId] &&
			!lobbies[lobbyId].users.some((user) => user.uuid === socket.id)
		) {
			socket.join(lobbyId)
			lobbies[lobbyId].users.push({
				uuid: socket.id,
				name: username,
				score: 0,
			})
			io.to(lobbyId).emit("updateCreator", lobbies[lobbyId].creator)
			console.log(`User ${socket.id} joined lobby ${lobbyId}`)

			// Update users list
			io.to(lobbyId).emit("updateUserList", lobbies[lobbyId].users)
		} else {
			socket.emit("error", "Lobby introuvable")
		}
	})

	// Start game with prefered settings
	socket.on("setupGame", (lobbyId, countriesList, roundLimit) => {
		// Init round
		lobbies[lobbyId].round = 1
		lobbies[lobbyId].roundLimit = Math.min(
			Math.max(Number(roundLimit), minRoundLimit),
			maxRoundLimit
		)
		lobbies[lobbyId].countriesList = countriesList
		lobbies[lobbyId].lastCountriesId = []
		const countryId = generateRandomCountryId(
			countriesList.length,
			lobbies[lobbyId].lastCountriesId
		)

		// reset scores
		resetScores(lobbyId)
		io.to(lobbyId).emit("updateUserList", lobbies[lobbyId].users)

		const targetDate = new Date(new Date().getTime() + roundDuration * 1000)
		lobbies[lobbyId].targetDate = targetDate

		// Start game
		io.to(lobbyId).emit("startGame", {
			countriesList,
			countryId,
			targetDate,
		})
		console.log(`Lobby ${lobbyId} started the game`)
	})

	socket.on("timerEnded", (lobbyId, playerId) => {
		if (!lobbies[lobbyId] || playerId !== lobbies[lobbyId].creator) return
		const firstPlayer = lobbies[lobbyId].playersWithGoodAnswer[0]

		io.to(lobbyId).emit(
			"endRound",
			firstPlayer ? firstPlayer.name : null,
			firstPlayer ? firstPlayer.guessTime : null
		)

		// Start new round
		setTimeout(() => {
			startNewRound(lobbyId, true)
		}, newRoundDelay)
	})

	socket.on("goodAnswer", (lobbyId, playerId) => {
		// Update score
		const player = lobbies[lobbyId].users.find(
			(user) => user.uuid === playerId
		)
		player.score += 1 // update system

		let guessTime =
			roundDuration -
			(lobbies[lobbyId].targetDate.getTime() - new Date().getTime()) /
				1000

		guessTime = Math.trunc(guessTime * 100) / 100

		lobbies[lobbyId].playersWithGoodAnswer.push({
			name: player.name,
			guessTime: guessTime,
		})
		io.to(lobbyId).emit("updateUserList", lobbies[lobbyId].users, player)

		if (
			lobbies[lobbyId].users.length ===
			lobbies[lobbyId].playersWithGoodAnswer.length
		) {
			const firstPlayer = lobbies[lobbyId].playersWithGoodAnswer[0]
			io.to(lobbyId).emit(
				"endRound",
				firstPlayer.name,
				firstPlayer.guessTime
			)

			// Start new round
			setTimeout(() => {
				startNewRound(lobbyId, true)
			}, newRoundDelay)
		}
	})

	socket.on("newRound", (lobbyId) => {
		startNewRound(lobbyId, false)
	})

	socket.on("badAnswer", (lobbyId, answer) => {
		io.to(lobbyId).emit("wrongAnswer", answer)
	})

	// leave lobby
	socket.on("leaveLobby", (lobbyId, playerId) => {
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
