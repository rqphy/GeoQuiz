import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./routes/home/Home.tsx"
import "./index.scss"
import Header from "./components/Header/Header.tsx"
import MultiPlayer from "./routes/multiplayer/MultiPlayer.tsx"
import SinglePlayer from "./routes/singleplayer/SinglePlayer.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Header />
			<Routes>
				<Route index element={<Home />} />
				<Route path="/singleplayer" element={<SinglePlayer />} />
				<Route path="/room/:roomId" element={<MultiPlayer />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
)
