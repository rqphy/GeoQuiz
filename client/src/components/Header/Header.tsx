import { Link } from "react-router-dom"
export default function Header() {
	return (
		<header className="fixed top-0 z-50 flex w-full justify-between px-16 py-10 uppercase font-family-secondary">
			<Link to={"/"} id="homelink" className="hover:underline">
				( Home )
			</Link>
			<a
				href="https://github.com/rqphy/GeoQuiz"
				className="hover:underline"
			>
				( Github )
			</a>
		</header>
	)
}
