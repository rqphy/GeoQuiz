import { useNavigate } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import Experience from "../../components/Experience/Experience"
import { useSocket } from "../../contexts/SocketManager"
import { Button } from "../../components/ui/button"
import { Gamepad2Icon, ChevronDown, Loader2, AlertTriangle } from "lucide-react"

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
			{/* Server connection warning banner */}
			{!isConnected && (
				<div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 text-black py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium animate-in slide-in-from-top duration-300">
					<AlertTriangle className="w-4 h-4" />
					<span>
						Connexion au serveur en cours... Veuillez patienter.
					</span>
					<Loader2 className="w-4 h-4 animate-spin" />
				</div>
			)}
			<section className="flex flex-col items-center justify-center h-screen bg-black">
				<div className="text-center z-10">
					<h1 className="text-6xl md:text-8xl uppercase font-family font-light">
						GEOQUIZ
					</h1>
					<Button
						onClick={handleCreateLobby}
						variant="secondary"
						className="mt-8 hover:cursor-pointer"
						disabled={!isConnected}
					>
						{isConnected ? (
							<>
								Lancez une partie
								<Gamepad2Icon />
							</>
						) : (
							<>
								Connexion au serveur...
								<Loader2 className="animate-spin" />
							</>
						)}
					</Button>
				</div>
				<div className="absolute bottom-0 left-0 w-full h-full">
					<Canvas camera={{ fov: 30, position: [6, 0, 0] }}>
						<Experience />
					</Canvas>
				</div>
				{/* Scroll indicator */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
					<span className="text-xs uppercase tracking-widest text-secondary">
						Scroll
					</span>
					<ChevronDown className="w-5 h-5 text-secondary" />
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
