import type { Datetime } from "./datetime";
import type { integer } from "./integer";

export type UpdateTask = {
	title: string | null;
	description: string | null;
	start_date: Datetime | null;
	end_date: Datetime | null;
	column_id: integer;
	archived: boolean | null;
};
