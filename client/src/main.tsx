import "./index.css"
import "./old.scss"
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SocketProvider } from "./contexts/SocketManager.tsx"
import { GameProvider } from "./contexts/GameManager.tsx"
import Home from "./routes/home/Home.tsx"
import Header from "./components/Header/Header.tsx"
import Lobby from "./routes/lobby/Lobby.tsx"
import Footer from "./components/Footer/Footer.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<SocketProvider>
		<GameProvider>
			<React.StrictMode>
				<BrowserRouter>
					<Header />
					<Routes>
						<Route index element={<Home />} />
						<Route path="/lobby/:lobbyId" element={<Lobby />} />
					</Routes>
					<Footer />
				</BrowserRouter>
			</React.StrictMode>
		</GameProvider>
	</SocketProvider>
)
