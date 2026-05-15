import type { integer } from "./integer";

export type Permission = {
	id: integer;
	name: string;
	description?: string;
}