import { ICountry } from "../../types/interfaces"
import { Gamemode } from "../../types/types"
import Question from "../Question/Question"
import GameForm from "../GameForm/GameForm"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import "./quiz.scss"
import { useSocket } from "../../contexts/SocketManager"
import Button from "../Button/Button"
import useGameStore from "../../stores/useGameStore"
import AnswerScreen from "../AnswerScreen/AnswerScreen"
import Timer from "../Timer/Timer"

interface IQuizzProps {
	countriesList: ICountry[]
	defaultCountryId: number
	firstTargetDate: Date
}

export default function Quiz({
	countriesList,
	defaultCountryId,
	firstTargetDate,
}: IQuizzProps) {
	const [countryId, setCountryId] = useState<number>(defaultCountryId)
	const [gamemode, setGamemode] = useState<Gamemode>("findCountry")
	const [questionLabel, setQuestionLabel] = useState<string>("")
	const [expectedAnswer, setExpectedAnswer] = useState<string>("")
	const [roundCount, setRoundCount] = useState<number>(1)
	const [targetDate, setTargetDate] = useState<Date>()
	const [isPaused, setIsPaused] = useState<boolean>(false)
	const [firstPlayer, setFirstPlayer] = useState<string | null>(null)
	const [answerTime, setAnswerTime] = useState<string | null>(null)
	const { lobbyId } = useParams()
	const { socket, players, methods } = useSocket()
	const { isCreator, wrongAnswersCount, resetWrongAnswersCount } =
		useGameStore()

	useEffect(() => {
		setTargetDate(firstTargetDate)
		socket.on(
			"startNewRound",
			({ serverRoundCount, countryId, gamemode, targetDate }) => {
				// reset round variables
				setIsPaused(false)
				setFirstPlayer(null)
				setAnswerTime(null)

				// update round count
				setRoundCount(serverRoundCount)

				// set round variables
				setTargetDate(targetDate)
				setCountryId(countryId)
				setGamemode(gamemode)
				resetWrongAnswersCount()
			}
		)

		socket.on("endRound", (player, time) => {
			setIsPaused(true)
			if (player && time) {
				setFirstPlayer(player)
				setAnswerTime(time)
			}
		})

		return () => {
			socket.off("startNewRound")
			socket.off("endRound")
		}
	}, [])

	useEffect(() => {
		if (gamemode === "findCapital") {
			setQuestionLabel(countriesList[countryId].country_name)
			setExpectedAnswer(countriesList[countryId].capital_name)
		} else {
			setQuestionLabel(countriesList[countryId].capital_name)
			setExpectedAnswer(countriesList[countryId].country_name)
		}
	}, [countryId, gamemode])

	function handleSkipClick(_event: any) {
		_event.preventDefault()
		methods.newRound(lobbyId as string)
	}

	function renderContent() {
		if (isPaused) {
			return (
				<AnswerScreen
					playername={firstPlayer}
					time={answerTime}
					answer={expectedAnswer}
				>
					<Question gamemode={gamemode} roundLabel={questionLabel} />
				</AnswerScreen>
			)
		} else {
			return (
				<>
					{targetDate && <Timer targetDate={targetDate} />}
					<p className="quiz__roundCount">Round : {roundCount}</p>
					<Question gamemode={gamemode} roundLabel={questionLabel} />
					<div className="quiz__container">
						<GameForm expectedAnswer={expectedAnswer} />
						{wrongAnswersCount >= players.length * 4 &&
							isCreator && (
								<Button
									label="Nouvelle question"
									className={`quiz__skip`}
									onClick={handleSkipClick}
								/>
							)}
					</div>
				</>
			)
		}
	}

	return <div className="quiz">{renderContent()}</div>
}
