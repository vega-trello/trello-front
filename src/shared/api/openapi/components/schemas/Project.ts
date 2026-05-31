import type { Datetime } from "./datetime";
import type { Nullable } from "./nullable";
import type { UUID } from "./uuid";

export type Project = {
  uuid: UUID;
  title: string;
  description: Nullable<string>;
  created_at: Datetime;
  updated_at: Datetime;
};
