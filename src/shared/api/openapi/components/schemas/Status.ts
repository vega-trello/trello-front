import type { Datetime } from "./datetime";
import type { integer } from "./integer";
import type { UUID } from "./uuid";

export type Status = {
	id: integer;
	project_uuid: UUID;
	name: string;
	created_at: Datetime;
};
