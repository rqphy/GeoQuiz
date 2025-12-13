import { useNavigate } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import Experience from "../../components/Experience/Experience"
import { useSocket } from "../../contexts/SocketManager"
import { Button } from "../../components/ui/button"
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/card"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../../components/ui/accordion"
import {
	Gamepad2Icon,
	ChevronDown,
	Loader2,
	AlertTriangle,
	Globe,
	Zap,
	Trophy,
	HelpCircle,
	Quote,
} from "lucide-react"

export default function Home() {
	const navigate = useNavigate()
	const { socket, methods, isConnected } = useSocket()

	function handleCreateLobby() {
		methods.createLobby()
		socket.on("lobbyCreated", ({ lobbyId, creator }) => {
			navigate(`/lobby/${lobbyId}`, { state: { creator: creator } })
		})
	}

	const tutorialCards = [
		{
			icon: Globe,
			title: "Devinez les capitales",
			description:
				"Trouvez la capitale d'un pays donné ou identifiez le pays d'une capitale. Testez vos connaissances géographiques !",
		},
		{
			icon: Zap,
			title: "Soyez rapide",
			description:
				"20 secondes pour répondre ! Plus vous répondez vite, plus vous marquez de points.",
		},
		{
			icon: Trophy,
			title: "Affrontez vos amis",
			description:
				"Jouez en multijoueur et grimpez dans le classement en battant vos adversaires !",
		},
	]

	const faqItems = [
		{
			question: "Comment sont calculés les points ?",
			answer: "Plus vous répondez rapidement, plus vous gagnez de points ! Une réponse instantanée rapporte le maximum de points, tandis qu'une réponse juste avant la fin du chrono rapporte moins. Une mauvaise réponse ne fait pas perdre de points.",
		},
		{
			question: "Combien de joueurs peuvent jouer ensemble ?",
			answer: "GeoQuiz supporte de 2 à 8 joueurs par partie. Plus on est de fous, plus on rit !",
		},
		{
			question: "Les questions sont-elles aléatoires ?",
			answer: "Oui ! Chaque partie propose un mélange aléatoire de questions sur les capitales et les pays du monde entier. Vous ne tomberez jamais deux fois sur la même série de questions.",
		},
		{
			question: "Puis-je jouer sur mobile ?",
			answer: "Absolument ! GeoQuiz est entièrement responsive et fonctionne parfaitement sur smartphone, tablette et ordinateur.",
		},
	]

	const reviews = [
		{
			name: "Marie L.",
			text: "Super jeu pour réviser sa géographie en s'amusant ! J'ai enfin retenu toutes les capitales d'Afrique.",
			rating: 5,
		},
		{
			name: "Thomas D.",
			text: "On joue avec mes collègues pendant la pause déj. L'ambiance est au top !",
			rating: 5,
		},
		{
			name: "Sophie M.",
			text: "Parfait pour les soirées entre amis. Simple, rapide et addictif !",
			rating: 4,
		},
	]

	return (
		<>
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
					<h1 className="text-8xl md:text-8xl uppercase font-family font-light text-secondary">
						GEOQUIZ
					</h1>
					<Button
						onClick={handleCreateLobby}
						variant="secondary"
						className="mt-9 hover:cursor-pointer"
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

				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
					<span className="text-s uppercase font-bold tracking-widest text-secondary">
						Scroll
					</span>
					<ChevronDown className="w-5 h-5 text-secondary" />
				</div>
			</section>

			{/* Tutorial Cards */}
			<section className="relative z-10 py-16 px-6">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-light font-family text-secondary text-center mb-12 uppercase tracking-wide">
						Comment jouer ?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{tutorialCards.map((card, index) => (
							<Card
								key={index}
								className="bg-secondary/5 border-secondary/20 backdrop-blur-sm"
							>
								<CardHeader className="text-center">
									<card.icon className="w-10 h-10 text-secondary mx-auto mb-3" />
									<CardTitle className="text-secondary text-xl">
										{card.title}
									</CardTitle>
									<CardDescription className="text-secondary/70 text-sm leading-relaxed">
										{card.description}
									</CardDescription>
								</CardHeader>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Statistics Counter */}
			<section className="relative z-10 py-16 px-6">
				<div className="max-w-3xl mx-auto text-center">
					<div className="bg-secondary/5 border border-secondary/20 backdrop-blur-sm rounded-2xl p-10">
						<p className="text-6xl md:text-7xl font-bold text-secondary mb-4">
							1200+
						</p>
						<p className="text-xl text-secondary/70 uppercase tracking-widest">
							Questions répondues
						</p>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="relative z-10 py-16 px-6">
				<div className="max-w-3xl mx-auto">
					<div className="flex items-center justify-center gap-3 mb-12">
						<HelpCircle className="w-8 h-8 text-secondary" />
						<h2 className="text-3xl md:text-4xl font-light font-family text-secondary text-center uppercase tracking-wide">
							FAQ
						</h2>
					</div>
					<Accordion type="single" collapsible className="space-y-4">
						{faqItems.map((item, index) => (
							<AccordionItem
								key={index}
								value={`item-${index}`}
								className="bg-secondary/5 border border-secondary/20 backdrop-blur-sm rounded-lg px-6"
							>
								<AccordionTrigger className="text-secondary hover:text-secondary/80 text-left">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="text-secondary/70">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>

			{/* Reviews Section */}
			<section className="relative z-10 py-16 px-6 pb-32">
				<div className="max-w-5xl mx-auto">
					<div className="flex items-center justify-center gap-3 mb-12">
						<Quote className="w-8 h-8 text-secondary" />
						<h2 className="text-3xl md:text-4xl font-light font-family text-secondary text-center uppercase tracking-wide">
							Ils adorent GeoQuiz
						</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{reviews.map((review, index) => (
							<Card
								key={index}
								className="bg-secondary/5 border-secondary/20 backdrop-blur-sm"
							>
								<CardHeader>
									<div className="flex gap-1 mb-2">
										{[...Array(5)].map((_, i) => (
											<span
												key={i}
												className={`text-lg ${
													i < review.rating
														? "text-yellow-400"
														: "text-secondary/30"
												}`}
											>
												★
											</span>
										))}
									</div>
									<CardDescription className="text-secondary/70 text-sm leading-relaxed italic mb-3">
										"{review.text}"
									</CardDescription>
									<CardTitle className="text-secondary text-base">
										— {review.name}
									</CardTitle>
								</CardHeader>
							</Card>
						))}
					</div>
				</div>
			</section>

			<div className="fixed bottom-0 left-0 w-full h-full">
				<Canvas camera={{ fov: 30, position: [6, 0, 0] }}>
					<Experience />
				</Canvas>
			</div>
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
