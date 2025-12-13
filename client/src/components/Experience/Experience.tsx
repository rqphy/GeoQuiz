import { useRef } from "react"
import * as THREE from "three"
import earthVertexShader from "./earth/vertex.glsl"
import earthFragmentShader from "./earth/fragment.glsl"
import { useLoader, useFrame } from "@react-three/fiber"

export default function Experience() {
	const earthDayTexture = useLoader(THREE.TextureLoader, "/earth/day.jpg")
	earthDayTexture.colorSpace = THREE.SRGBColorSpace
	earthDayTexture.anisotropy = 8
	const earthNightTexture = useLoader(THREE.TextureLoader, "/earth/night.jpg")
	earthNightTexture.colorSpace = THREE.SRGBColorSpace
	earthNightTexture.anisotropy = 8
	const earthSpecularCloudsTexture = useLoader(
		THREE.TextureLoader,
		"/earth/specularClouds.jpg"
	)
	earthSpecularCloudsTexture.colorSpace = THREE.SRGBColorSpace

	const earthRef = useRef<THREE.Mesh | null>(null)

	useFrame(() => {
		if (earthRef.current) {
			// earthRef.current.rotation.y += 0.0001
			earthRef.current.rotation.x += 0.00007
		}
	})

	return (
		<>
			<mesh ref={earthRef} position={[0, -2.3, 0]} rotation={[0, 0, 0]}>
				<sphereGeometry args={[4, 64, 64]} />
				<shaderMaterial
					uniforms={{
						uDayTexture: new THREE.Uniform(earthDayTexture),
						uDotSize: new THREE.Uniform(10.0),
					}}
					vertexShader={earthVertexShader}
					fragmentShader={earthFragmentShader}
				/>
			</mesh>
		</>
	)
}
