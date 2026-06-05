import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
	return {
		plugins: [react()],
		base:
			mode === "gh-pages" ? "/trello-front/" : (process.env.BASE_PATH ?? "/"),
	};
});
