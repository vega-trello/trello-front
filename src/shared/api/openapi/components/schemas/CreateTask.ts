import type { Datetime } from "./datetime";
import type { integer } from "./integer";

export type CreateTask = {
	title: string;
	description?: string;
	start_date?: Datetime;
	end_date?: Datetime;
	column_id?: integer;
}