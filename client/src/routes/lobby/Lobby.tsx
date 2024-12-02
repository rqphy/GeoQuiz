import EuropeFR from "../../data/FR/europe.json"
import AfricaFR from "../../data/FR/africa.json"
import AsiaFR from "../../data/FR/asia.json"
import NorthAmericaFR from "../../data/FR/north_america.json"
import SouthAmericaFR from "../../data/FR/south_america.json"
import OceaniaFR from "../../data/FR/oceania.json"
import "./lobby.scss"
import { FormEvent, useEffect, useState } from "react"
import Lobbyform from "../../components/LobbyForm/LobbyForm"
import ScoreBoard from "../../components/ScoreBoard/ScoreBoard"
import Quizz from "../../components/Quizz/Quiz"
import UsernameForm from "../../components/UsernameForm/UsernameForm"
import { ICountry } from "../../types/interfaces"
import { Region } from "../../types/types"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import PlayerList from "../../components/PlayerList/PlayerList"
import Button from "../../components/Button/Button"
import WrongAnswerDisplay from "../../components/WrongAnswerDisplay/WrongAnswerDisplay"
import { useSocket } from "../../contexts/SocketManager"
import FinalScore from "../../components/FinalScore/FinalScore"
import useGameStore from "../../stores/useGameStore"

const continentsData: Record<Region, ICountry[]> = {
	EU: EuropeFR,
	AS: AsiaFR,
	NA: NorthAmericaFR,
	SA: SouthAmericaFR,
	OC: OceaniaFR,
	AF: AfricaFR,
}

export default function Lobby() {
	const navigate = useNavigate()
	const location = useLocation()
	const { socket, methods, players } = useSocket()
	const { lobbyId } = useParams()
	const [playerUsername, setPlayerUsername] = useState<string | null>()
	const [coutriesList, setCountriesList] = useState<ICountry[]>([])
	const [creatorId, setCreatorId] = useState<string>("")
	const [defaultCountryId, setDefaultCountryId] = useState<number>(0)
	const [isGameOn, setIsGameOn] = useState<boolean>(false)
	const { isCreator, setIsCreator } = useGameStore()
	const [defaultTargetDate, setDefaultTargetDate] = useState<Date>()

	useEffect(() => {
		// Check if creator
		const creator = location.state?.creator
		if (creator) {
			setCreatorId(creator)
		}
		// Check if the current user is the creator
		setIsCreator(socket.id === creator)

		socket.on("startGame", ({ countriesList, countryId, targetDate }) => {
			console.log("start game", countriesList)
			setCountriesList(countriesList)
			setDefaultCountryId(countryId)
			setIsGameOn(true)
			setDefaultTargetDate(targetDate)
		})

		socket.on("updateCreator", (newCreatorId) => {
			setCreatorId(newCreatorId)
			setIsCreator(socket.id === newCreatorId)
		})

		socket.on("error", () => {
			navigate("/")
		})

		socket.on("endGame", () => {
			setIsGameOn(false)
		})

		return () => {
			if (!lobbyId || !socket.id) return
			methods.leaveLobby(lobbyId, socket.id)
			socket.off("startGame")
			socket.off("updateCreator")
			socket.off("error")
		}
	}, [lobbyId])

	function handleRestart(_event: any) {
		_event.preventDefault()
		setCountriesList([])
	}

	function handleUsernameSubmit(_event: FormEvent<HTMLFormElement>): void {
		_event.preventDefault()
		const submittedName = new FormData(_event.currentTarget).get("username")
		let username: string = submittedName?.toString() ?? "Toto"
		setPlayerUsername(username)

		// Join the lobby
		if (!lobbyId) return
		methods.joinLobby(lobbyId, username)
	}

	function handlePartySubmit(_event: FormEvent<HTMLFormElement>): void {
		_event.preventDefault()
		const submittedContinentList = new FormData(_event.currentTarget)
		let roundLimit = submittedContinentList.get("roundLimit") ?? "20"
		const tempCountriesList: ICountry[] = []
		for (const key of [...submittedContinentList.keys()]) {
			if (key !== "roundLimit") {
				tempCountriesList.push(...continentsData[key as Region])
			}
		}

		if (!lobbyId) return
		methods.setupGame(lobbyId, tempCountriesList, roundLimit as string)
	}

	function renderContent() {
		if (playerUsername) {
			if (coutriesList.length > 1) {
				if (isGameOn) {
					return (
						<>
							<WrongAnswerDisplay />
							<Quizz
								countriesList={coutriesList}
								defaultCountryId={defaultCountryId}
								firstTargetDate={defaultTargetDate as Date}
							/>
							<ScoreBoard playerList={players} />
						</>
					)
				} else {
					return (
						<>
							<h2>Game ended</h2>
							<FinalScore playerList={players} />
							<Button
								onClick={handleRestart}
								label="Revenir au lobby"
								className={`${!isCreator && "disabled"}`}
							/>
						</>
					)
				}
			} else {
				if (isCreator) {
					return (
						<>
							<section className="lobby__creation">
								<h2>Créez votre quizz:</h2>
								<Lobbyform onSubmit={handlePartySubmit} />
							</section>
							<ScoreBoard playerList={players} />
						</>
					)
				} else {
					return (
						<>
							<section className="lobby__list">
								<h2>Lobby</h2>
								<PlayerList
									list={players}
									creatorId={creatorId}
									currentId={socket.id ?? ""}
								/>
								<Button
									label="En attente du créateur"
									className="disabled lobby__list--button"
								/>
							</section>
						</>
					)
				}
			}
		} else {
			return (
				<section className="lobby__name">
					<h2>Choisissez un nom:</h2>
					<UsernameForm onSubmit={handleUsernameSubmit} />
				</section>
			)
		}
	}

	return <section className="lobby">{renderContent()}</section>
}
