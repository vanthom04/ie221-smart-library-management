import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"

import { defineConfig } from "vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }]
  }
})
