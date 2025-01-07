import "./experience.scss"
import { useRef } from "react"
import * as THREE from "three"
import earthVertexShader from "./earthShader/vertex.glsl"
import earthFragmentShader from "./earthShader/fragment.glsl"
import { useLoader, useFrame } from "@react-three/fiber"

export default function Experience() {
    const earthSpecularTexture = useLoader(
        THREE.TextureLoader,
        "/earth/specular.jpg"
    )

    const earthRef = useRef<THREE.Mesh | null>(null)

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.0008
        }
    })

    return (
        <>
            <directionalLight
                position={[3, 2, 4]}
                intensity={1}
                color={"#ffffff"}
            />
            <ambientLight intensity={0.3} />
            <mesh
                ref={earthRef}
                position={[0, -2, -1]}
                rotation={[Math.PI / 6, 0, 0]}
            >
                <sphereGeometry args={[4, 64, 64]} />
                <shaderMaterial
                    uniforms={{
                        uLandTexture: { value: earthSpecularTexture },
                        uDotSize: { value: 0.004 },
                        uColor: { value: new THREE.Color(0xd8f3dc) },
                        uOceanColorStart: { value: new THREE.Color(0xd8f3dc) },
                        uOceanColorEnd: { value: new THREE.Color(0x74c69d) },
                        uTotalDots: { value: 5000 },
                        GLOBE_RADIUS: { value: 2 },
                    }}
                    vertexShader={earthVertexShader}
                    fragmentShader={earthFragmentShader}
                />
            </mesh>
        </>
    )
}
