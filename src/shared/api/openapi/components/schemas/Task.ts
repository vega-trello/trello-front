import type { Datetime } from "./datetime";
import type { integer } from "./integer";
import type { UUID } from "./uuid";

export type Task = {
	id: number;
	column_id?: integer;
	status_id?: integer;
	creator_uuid: UUID;
	title?: string;
	description?: string;
	start_date?: Datetime;
	end_date?: Datetime;
	created_at: Datetime;
	updated_at: Datetime;
	archived_at?: Datetime;
}