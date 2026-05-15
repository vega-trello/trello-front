import type { Datetime } from "./datetime";
import type { integer } from "./integer";
import type { UUID } from "./uuid";

export type Assignee = {
  task_id: integer;
  user_uuid: UUID;
  assigned_at: Datetime;
};
