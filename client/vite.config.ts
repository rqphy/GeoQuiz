import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import glsl from "vite-plugin-glsl"
import dotenv from "dotenv"

// run package config
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), glsl(), tailwindcss()],
	define: {
		"process.env": process.env,
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "@/styles/mixins.scss";`,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
})
