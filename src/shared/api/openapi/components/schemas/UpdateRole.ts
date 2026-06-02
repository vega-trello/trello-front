import type { integer } from "./integer";
import type { Nullable } from "./nullable";

export type UpdateRole = {
	name: string;
	description: Nullable<string>;
	permission_ids: integer[];
};
