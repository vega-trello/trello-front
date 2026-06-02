import type { Color } from "./color";
import type { Datetime } from "./datetime";
import type { integer } from "./integer";
import type { Nullable } from "./nullable";

export type UpdateTask = {
	title: Nullable<string>;
	status_id: Nullable<integer>;
	description: Nullable<string>;
	color: Nullable<Color>;
	start_date: Nullable<Datetime>;
	end_date: Nullable<Datetime>;
	column_id: integer;
	done: boolean;
	archived: boolean;
};
