import Button from "../Button/Button"
import { useState } from "react"
import "./gameform.scss"
import { useParams } from "react-router-dom"
import { useSocket } from "../../contexts/SocketManager"

function removeAccents(str: string): string {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function checkAnswer(expectedAnswer: string, answer: string): boolean {
	if (!answer) return false
	expectedAnswer = removeAccents(expectedAnswer).toLowerCase()
	answer = removeAccents(answer).toLowerCase()
	if (expectedAnswer !== answer) return false
	return true
}

interface IGameFormProps {
	expectedAnswer: string
}

export default function GameForm({ expectedAnswer }: IGameFormProps) {
	const { lobbyId } = useParams()
	const [isAnimating, setIsAnimating] = useState<boolean>(false)
	const { socket, methods } = useSocket()

	function startFailAnimation(): void {
		setIsAnimating(false)
		setTimeout(() => setIsAnimating(true), 0)
	}

	function handleSubmit(_event: React.FormEvent<HTMLFormElement>) {
		_event.preventDefault()

		const inputValue: string = (
			(_event.target as HTMLFormElement)[0] as HTMLInputElement
		).value

		if (checkAnswer(expectedAnswer, inputValue)) {
			// tada + next round + player point
			if (!lobbyId || !socket.id) return
			methods.goodAnswer(lobbyId, socket.id)
		} else {
			// emit answer
			if (!lobbyId || !socket.id) return
			startFailAnimation()
			methods.badAnswer(lobbyId, inputValue)
		}

		// Clear input
		;((_event.target as HTMLFormElement)[0] as HTMLInputElement).value = ""
	}

	return (
		<form onSubmit={handleSubmit} className="gameform">
			<input
				type="text"
				placeholder="Répondre ici..."
				className={isAnimating ? "gameform__animated" : ""}
				autoFocus
				required
			/>
			<Button label="Valider" />
		</form>
	)
}
