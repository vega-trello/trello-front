import type { Datetime } from "./datetime";
import type { UUID } from "./uuid";

export type Project = {
  uuid: UUID;
  title: string;
  description?: string;
  created_at: Datetime;
  updated_at: Datetime;
};
