import type { integer } from "./integer";
import type { UUID } from "./uuid";

export type CreateMember = {
  user_uuid: UUID;
  role_id: integer;
};
