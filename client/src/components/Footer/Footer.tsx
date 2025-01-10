import "./footer.scss"

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">
                <p>
                    <a href="https://www.raphael-ferreira.com">
                        Développé par <span>Raphaël Ferreira</span>
                    </a>
                </p>
                <p>© {new Date().getFullYear()} GeoQuiz</p>
                <p>
                    <a href="https://github.com/rqphy/GeoQuiz" target="_blank">
                        github
                    </a>
                </p>
            </div>
        </footer>
    )
}
