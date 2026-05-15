import type { integer } from "./integer";

export type CreateRole = {
  name: string;
  description?: string;
  permission_ids: integer[];
};
