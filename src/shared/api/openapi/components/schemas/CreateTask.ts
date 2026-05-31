import type { Datetime } from "./datetime";
import type { integer } from "./integer";
import type { Nullable } from "./nullable";

export type CreateTask = {
	title: string;
	description: Nullable<string>;
	start_date: Nullable<Datetime>;
	end_date: Nullable<Datetime>;
	column_id: integer;
};
