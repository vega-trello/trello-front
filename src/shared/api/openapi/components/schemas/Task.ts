import type { Datetime } from "./datetime";
import type { integer } from "./integer";
import type { UUID } from "./uuid";
import type { Nullable } from "./nullable";

export type Task = {
	id: number;
	column_id: integer;
	status_id: Nullable<integer>;
	creator_uuid: UUID;
	title: Nullable<string>;
	description: Nullable<string>;
	start_date: Nullable<Datetime>;
	end_date: Nullable<Datetime>;
	created_at: Datetime;
	updated_at: Datetime;
	archived_at: Nullable<Datetime>;
};
