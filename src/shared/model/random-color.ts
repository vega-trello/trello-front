import type { Color } from "../api/openapi/components/schemas";

export function randomHexColor(): Color {
	return `#${Math.floor(Math.random() * 0xffffff)
		.toString(16)
		.padStart(6, "0")}`;
}
