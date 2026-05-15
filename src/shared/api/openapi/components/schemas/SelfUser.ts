import type { Datetime } from "./datetime";
import type { User } from "./User";
import type { UserType } from "./UserType";

export type SelfUser = User & {
  created_at: Datetime;
  updated_at: Datetime;
  user_type: UserType;
};
