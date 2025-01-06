import "./experience.scss"
import { useRef } from "react"
import * as THREE from "three"
import earthVertexShader from "./earthShader/vertex.glsl"
import earthFragmentShader from "./earthShader/fragment.glsl"

export default function Experience() {
    return (
        <>
            <directionalLight
                position={[3, 2, 4]}
                intensity={1}
                color={"#ffffff"}
            />
            <ambientLight intensity={0.3} />
            <mesh>
                <sphereGeometry />
                <shaderMaterial
                    vertexShader={earthVertexShader}
                    fragmentShader={earthFragmentShader}
                />
            </mesh>
        </>
    )
}
