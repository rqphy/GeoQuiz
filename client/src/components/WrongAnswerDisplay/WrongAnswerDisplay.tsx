import { useEffect, useState } from "react"
import "./wronganswerdisplay.scss"
import socket from "../../socket"

interface IAnswer {
	id: number
	text: string
	coords: { left: number; top: number }
}

function generateRandomCoords() {
	let sideMargins = 10 // in percentage
	let topMargins = 10 // in percentage

	let leftCoord =
		Math.round(Math.random() * (100 - 2 * sideMargins)) + sideMargins
	let topCoord =
		Math.round(Math.random() * (100 - 2 * topMargins)) + topMargins

	return { left: leftCoord, top: topCoord }
}

export default function WrongAnswerDisplay() {
	const [answers, setAnswers] = useState<IAnswer[]>([])

	useEffect(() => {
		socket.on("wrongAnswer", (answer: string) => {
			console.log("WRONG", answer)
			// Create a unique ID for each answer
			const id = Date.now()
			setAnswers((prevAnswers) => [
				...prevAnswers,
				{ id: id, text: answer, coords: generateRandomCoords() },
			])

			// Remove the answer after 5s
			setTimeout(() => {
				setAnswers((prevAnswers) =>
					prevAnswers.filter((answer) => answer.id !== id)
				)
			}, 5000)
		})

		return () => {
			socket.off("wrongAnswer")
		}
	}, [])

	return (
		<div className="answerdisplay">
			{answers.map((answer) => (
				<p
					className="answerdisplay__answer"
					style={{
						top: `${answer.coords.top}%`,
						left: `${answer.coords.left}%`,
					}}
					key={answer.id}
				>
					{answer.text}
				</p>
			))}
		</div>
	)
}