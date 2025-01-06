import { Canvas } from "@react-three/fiber"
import Experience from "../../components/Experience/Experience"
import "./model.scss"

export default function Model() {
    return (
        <div className="model">
            <Canvas>
                <Experience />
            </Canvas>
        </div>
    )
}
