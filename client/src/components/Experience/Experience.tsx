import "./experience.scss"
import { useRef } from "react"
import * as THREE from "three"
import earthVertexShader from "./earth/vertex.glsl"
import earthFragmentShader from "./earth/fragment.glsl"
import atmosphereVertexShader from "./atmosphere/vertex.glsl"
import atmosphereFragmentShader from "./atmosphere/fragment.glsl"
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
			earthRef.current.rotation.y += 0.0008
		}
	})

	return (
		<>
			<mesh
				ref={earthRef}
				position={[0, -2.3, 0]}
				rotation={[-Math.PI / 10, 0, 0]}
			>
				<sphereGeometry args={[4, 64, 64]} />
				<shaderMaterial
					uniforms={{
						uDayTexture: new THREE.Uniform(earthDayTexture),
						uNightTexture: new THREE.Uniform(earthNightTexture),
						uSpecularCloudsTexture: new THREE.Uniform(
							earthSpecularCloudsTexture
						),
						uSunDirection: new THREE.Uniform(
							new THREE.Vector3(0, 0, 1)
						),
						uAtmosphereDayColor: new THREE.Uniform(
							new THREE.Color("#00aaff")
						),
						uAtmosphereTwilightColor: new THREE.Uniform(
							new THREE.Color("#ff3300")
						),
					}}
					vertexShader={earthVertexShader}
					fragmentShader={earthFragmentShader}
				/>
			</mesh>
			<mesh
				position={[0, -2.3, 0]}
				rotation={[0, 0, Math.PI / 8]}
				scale={[1.04, 1.04, 1.04]}
			>
				<sphereGeometry args={[4, 64, 64]} />
				<shaderMaterial
					transparent={true}
					side={THREE.BackSide}
					uniforms={{
						uSunDirection: new THREE.Uniform(
							new THREE.Vector3(0, 0, 1)
						),
						uAtmosphereDayColor: new THREE.Uniform(
							new THREE.Color("#00aaff")
						),
						uAtmosphereTwilightColor: new THREE.Uniform(
							new THREE.Color("#ff3300")
						),
					}}
					vertexShader={atmosphereVertexShader}
					fragmentShader={atmosphereFragmentShader}
				/>
			</mesh>
		</>
	)
}
