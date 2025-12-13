import { useNavigate } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import Experience from "../../components/Experience/Experience"
import { useSocket } from "../../contexts/SocketManager"
import { Button } from "../../components/ui/button"
import { Gamepad2Icon } from "lucide-react"

export default function Home() {
	const navigate = useNavigate()
	const { socket, methods, isConnected } = useSocket()

	function handleCreateLobby() {
		methods.createLobby()
		socket.on("lobbyCreated", ({ lobbyId, creator }) => {
			navigate(`/lobby/${lobbyId}`, { state: { creator: creator } })
		})
	}

	return (
		<>
			<section className="flex flex-col items-center justify-center h-screen bg-black">
				<div className="text-center z-10">
					<h1 className="text-6xl md:text-8xl uppercase font-family font-light">
						GEOQUIZ
					</h1>
					<Button
						onClick={handleCreateLobby}
						variant="secondary"
						className="mt-8 hover:cursor-pointer"
					>
						Lancez une partie
						<Gamepad2Icon />
					</Button>
				</div>
				<div className="absolute bottom-0 left-0 w-full h-[70vh]">
					<Canvas camera={{ fov: 40, position: [6, 0, 0] }}>
						<Experience />
					</Canvas>
				</div>
			</section>
		</>
	)
}

{
	/* <section className="hero">
	<div className="hero__content">
		<h1 className="hero__title">GEOQUIZ</h1>
		<p className="hero__description">
			Mettez vos connaissances en géographie à l'épreuve dans
			ce jeu de trivia multijoueur rapide ! Les joueurs
			répondent à deux types de questions : trouver la
			capitale d'un pays donné ou nommer le pays d'une
			capitale donnée. Avec un chronomètre de 20 secondes,
			tout le monde peut deviner, mais plus vous répondez vite
			correctement, plus vous marquez de points. Affrontez vos
			amis ou des joueurs du monde entier et grimpez dans le
			classement&nbsp;!
		</p>
		<div className="hero__actions">
			<Button
				label="Jouer"
				className={`hero__play ${
					isConnected ? "" : "disabled"
				}`}
				onClick={handleCreateLobby}
			/>
			{!isConnected && (
				<p className="hero__loading">
					Veuillez patienter pendant que nous nous
					connectons au serveur...
				</p>
			)}
		</div>
	</div>
	<div className="hero__planet">
		<Canvas camera={{ fov: 40, position: [6, 0, 0] }}>
			<Experience />
		</Canvas>
	</div>
</section> */
}
