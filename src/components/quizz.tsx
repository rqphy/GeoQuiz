import { ICountry } from "../types/interfaces"
import { Gamemode } from "../types/types"
import Question from "./Question"
import GameForm from "./GameForm"
import { useEffect, useState } from "react"

interface IQuizzProps {
	countriesList: ICountry[]
}

export default function Quizz({ countriesList }: IQuizzProps) {
	const [countryId, setCountryId] = useState<number>(14)
	const [gamemode, setGamemode] = useState<Gamemode>("findCountry")
	const [questionLabel, setQuestionLabel] = useState<string>("")
	const [expectedAnswer, setExpectedAnswer] = useState<string>("")

	useEffect(() => {
		if (gamemode === "findCapital") {
			setQuestionLabel(countriesList[countryId].country_name)
			setExpectedAnswer(countriesList[countryId].capital_name)
		} else {
			setQuestionLabel(countriesList[countryId].capital_name)
			setExpectedAnswer(countriesList[countryId].country_name)
		}
	}, [countryId])

	return (
		<div>
			<Question gamemode={gamemode} roundLabel={questionLabel} />
			<GameForm expectedAnswer={expectedAnswer} />
		</div>
	)
}
