import type { integer } from "./integer";

export type UpdateRole = {
  name: string;
  description: string | null;
  permission_ids: integer[];
};
