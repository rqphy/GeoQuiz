import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"
import { io, Socket } from "socket.io-client"
import { ICountry, IPlayer } from "../types/interfaces"

// Socket Context
interface ISocketProviderMethods {
	createLobby: () => void
	requestLobbyAccess: (lobbyId: string) => void
	joinLobby: (lobbyId: string, username: string) => void
	leaveLobby: (lobbyId: string, userId: string) => void
	setupGame: (
		lobbyId: string,
		countriesList: ICountry[],
		roundLimit: string
	) => void
	goodAnswer: (lobbyId: string, userId: string) => void
	badAnswer: (lobbyId: string, answer: string) => void
	newRound: (lobbyId: string) => void
	timerEnded: (lobbyId: string) => void
}

interface ISocketContextProps {
	socket: Socket
	players: IPlayer[]
	methods: ISocketProviderMethods
	isConnected: boolean
}
const SocketContext = createContext<ISocketContextProps | undefined>(undefined)
const socket: Socket = io(process.env.REACT_APP_API_URL, {
	withCredentials: true,
	transports: ["websocket"],
})

interface ISocketProviderProps {
	children: ReactNode
}

export function SocketProvider({ children }: ISocketProviderProps) {
	const [players, setPlayers] = useState<IPlayer[]>([])
	const [isConnected, setIsConnected] = useState<boolean>(false)

	useEffect(() => {
		socket.on("connect", () => {
			setIsConnected(true)
			console.log("Connected to server:" + socket.id)
		})

		socket.on("disconnect", () => {
			setIsConnected(false)
			console.log("Disconnected from server")
		})

		socket.on("updateUserList", (userList) => {
			setPlayers(userList)
		})

		return () => {
			socket.off("connect")
			socket.off("disconnect")
			socket.off("updateUserList")
		}
	}, [])

	const methods = {
		createLobby(): void {
			socket.emit("createLobby")
			console.log("create lobby")
		},
		requestLobbyAccess(lobbyId: string): void {
			socket.emit("requestLobbyAccess", lobbyId)
		},
		joinLobby(lobbyId: string, username: string): void {
			socket.emit("joinLobby", lobbyId, username)
		},
		leaveLobby(lobbyId: string, userId: string): void {
			socket.emit("leaveLobby", lobbyId, userId)
		},
		setupGame(
			lobbyId: string,
			countriesList: ICountry[],
			roundLimit: string
		): void {
			socket.emit("setupGame", lobbyId, countriesList, roundLimit)
		},
		goodAnswer(lobbyId: string, userId: string): void {
			socket.emit("goodAnswer", lobbyId, userId)
		},
		badAnswer(lobbyId: string, answer: string) {
			socket.emit("badAnswer", lobbyId, answer)
		},
		newRound(lobbyId: string) {
			socket.emit("newRound", lobbyId)
		},
		timerEnded(lobbyId: string) {
			socket.emit("timerEnded", lobbyId, socket.id)
		},
	}

	return (
		<SocketContext.Provider
			value={{ socket, players, methods, isConnected }}
		>
			{children}
		</SocketContext.Provider>
	)
}

export const useSocket = () => {
	const context = useContext(SocketContext)
	if (!context) {
		throw new Error("useSocket doit etre utilise dans un SocketProvider")
	}
	return context
}
