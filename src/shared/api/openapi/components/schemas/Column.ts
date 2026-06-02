import type { Color } from "./color";
import type { Datetime } from "./datetime";
import type { integer } from "./integer";
import type { Nullable } from "./nullable";
import type { UUID } from "./uuid";

export type Column = {
	id: integer;
	project_uuid: UUID;
	name: string;
	position: integer;
	color: Nullable<Color>;
	created_at: Datetime;
};
