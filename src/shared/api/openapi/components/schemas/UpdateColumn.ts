import type { Color } from "./color";
import type { Nullable } from "./nullable";

export type UpdateColumn = {
	name: string;
	color: Nullable<Color>;
};
