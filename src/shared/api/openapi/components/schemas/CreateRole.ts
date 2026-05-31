import type { integer } from "./integer";
import type { Nullable } from "./nullable";

export type CreateRole = {
  name: string;
  description: Nullable<string>;
  permission_ids: integer[];
};
