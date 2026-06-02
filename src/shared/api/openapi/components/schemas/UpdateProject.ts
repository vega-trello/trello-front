import type { Nullable } from "./nullable";

export type UpdateProject = {
	title: string;
	description: Nullable<string>;
};
