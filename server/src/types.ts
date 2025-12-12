import type { Socket } from "socket.io"

export interface Player {
    uuid: string
    name: string
    score: number
    hasGuessed: boolean
}

export interface PlayerWithGuessTime {
    name: string
    guessTime: number
}

export interface Country {
    id: number
    name: string
    capital: string
    // Add other country properties as needed
}

export interface Lobby {
    users: Player[]
    creator: string
    round?: number
    roundLimit: number
    countriesList?: unknown[]
    lastCountriesId?: number[]
    playersWithGoodAnswer: PlayerWithGuessTime[]
    targetDate: Date | null
    roundDelay: number
}

export type Lobbies = Record<string, Lobby>

export type GameSocket = Socket
