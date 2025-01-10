import "./header.scss"
import { Link } from "react-router-dom"
export default function Header() {
    return (
        <header>
            <Link to={"/"}>
                <img src="/logo.png" alt="GeoQuiz" />
            </Link>
        </header>
    )
}
