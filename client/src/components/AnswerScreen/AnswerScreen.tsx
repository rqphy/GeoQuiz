import { ReactNode } from "react"
import "./answerscreen.scss"

interface IAnswerScreenProps {
	playername: string | null
	answer: string
	time: string | null
	children: ReactNode
}

export default function AnswerScreen({
	playername,
	answer,
	time,
	children,
}: IAnswerScreenProps) {
	return (
		<section className="answerscreen">
			{children}
			<p className="answerscreen__answer">
				La réponse était : <span>{answer}</span>
			</p>
			{playername && time && (
				<p className="answerscreen__name">
					<span>{playername}</span> l'a trouvé en premier en{" "}
					<span>{time + " "}</span>
					secondes
				</p>
			)}
		</section>
	)
}
