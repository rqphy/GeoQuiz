import { v4 as uuidv4 } from "uuid"
import { useNavigate } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import "./home.scss"
import Button from "../../components/Button/Button"
import Experience from "../../components/Experience/Experience"

export default function Home() {
	const navigate = useNavigate()

	function handlePlayClick() {
		navigate(`/lobby/${uuidv4()}`)
	}

	return (
		<>
			<section className="hero">
				<div className="hero__content">
					<h1 className="hero__title">Bienvenue sur GeoQuizz!</h1>
					<p className="hero__description">
						Customisez votre quizz et jouez seul ou à plusieurs.
					</p>
					<Button
						label="Jouer"
						className="hero__play"
						onClick={handlePlayClick}
					/>
				</div>
				<div className="hero__planet">
					<Canvas>
						<Experience />
					</Canvas>
				</div>
			</section>
		</>
	)
}
