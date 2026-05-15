import type { Color } from "./color";
import type { Datetime } from "./datetime";
import type { integer } from "./integer"
import type { UUID } from "./uuid";

export type Tag = {
	id: integer;
	project_uuid: UUID;
	name: string;
	color: Color;
	created_at: Datetime;
}