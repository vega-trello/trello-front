import type { Datetime } from "./datetime";
import type { integer } from "./integer";
import type { UUID } from "./uuid";

export type Column = {
  id: integer;
  project_uuid: UUID;
  name: string;
  position: integer;
  created_at: Datetime;
};
