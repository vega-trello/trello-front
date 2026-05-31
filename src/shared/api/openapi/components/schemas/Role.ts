import type { integer } from "./integer";
import type { Nullable } from "./nullable";
import type { UUID } from "./uuid";

export type Role = {
  id: integer;
  project_uuid: Nullable<UUID>;
  name: string;
  description: Nullable<string>;
};
