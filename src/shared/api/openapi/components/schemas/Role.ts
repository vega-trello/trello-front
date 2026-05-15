import type { integer } from "./integer";
import type { UUID } from "./uuid";

export type Role = {
  id: integer;
  project_uuid?: UUID;
  name: string;
  description?: string;
};
