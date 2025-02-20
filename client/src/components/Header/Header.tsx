import "./header.scss"
import { Link } from "react-router-dom"
export default function Header() {
	return (
		<header>
			<Link to={"/"} id="homelink">
				GeoQuiz
			</Link>
			<a href="https://github.com/rqphy/GeoQuiz">Github</a>
		</header>
	)
}
