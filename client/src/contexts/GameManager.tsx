import React, { createContext, ReactNode, useState } from "react"

interface IGameContextProps {
    isCreator: boolean
    wrongAnswersCount: number
    incrementWrongAnswersCount: () => void
    resetWrongAnswersCount: () => void
    setIsCreator: React.Dispatch<React.SetStateAction<boolean>>
}

interface IGameProviderProps {
    children: ReactNode
}

const GameContext = createContext<IGameContextProps | null>(null)

export function GameProvider({ children }: IGameProviderProps) {
    const [isCreator, setIsCreator] = useState<boolean>(false)
    const [wrongAnswersCount, setWrongAnswersCount] = useState<number>(0)

    function incrementWrongAnswersCount(): void {
        setWrongAnswersCount((prevCount) => prevCount + 1)
    }

    function resetWrongAnswersCount(): void {
        setWrongAnswersCount(0)
    }

    return (
        <GameContext.Provider
            value={{
                isCreator,
                wrongAnswersCount,
                incrementWrongAnswersCount,
                resetWrongAnswersCount,
                setIsCreator,
            }}
        >
            {children}
        </GameContext.Provider>
    )
}

export function useGameStore() {
    const context = React.useContext(GameContext)
    if (!context) {
        throw new Error("useGameStore must be used within a GameProvider")
    }
    return context
}
