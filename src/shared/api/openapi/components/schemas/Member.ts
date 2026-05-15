import type { Datetime } from "./datetime";
import type { integer } from "./integer";
import type { User } from "./User";
import type { UUID } from "./uuid";

export type Member = User & {
  project_uuid: UUID;
  role_id: integer;
  joined_at: Datetime;
};
