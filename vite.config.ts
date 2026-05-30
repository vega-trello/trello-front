import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
	console.log({ mode });
	return {
		plugins: [react()],
		base: mode === "gh-pages" ? "/trello-front/" : "/",
		build: {
			rolldownOptions: {
				output: {},
			},
		},
	};
});
