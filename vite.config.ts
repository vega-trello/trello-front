import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "gh-pages" ? "/trello-front/" : "/",
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: true,
      },
    },
  },
}));
