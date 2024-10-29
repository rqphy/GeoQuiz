import { Server } from "socket.io"
import { v4 as uuidv4 } from "uuid"

const io = new Server({
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
	},
})

const lobbies = {}

io.listen(3000)

io.on("connection", (socket) => {
	console.log("user connected")

	// Create Lobby
	socket.on("createLobby", () => {
		const lobbyId = uuidv4() // Generate unique lobby ID
		lobbies[lobbyId] = { users: [] } // Init lobby with empty user
		socket.join(lobbyId) // Have the user join the lobby
		lobbies[lobbyId].users.push(socket.id) // Add the user to the lobby's users

		// Emit back to the client
		socket.emit("lobbyCreated", lobbyId)
		console.log("Lobby created with ID:", lobbyId)
	})

	socket.on("disconnect", () => {
		console.log("user disconnected")
	})
})
