import type { Password } from "./password";
import type { Username } from "./username";

export type UpdateUser = {
  old_password: Password;
  username: Username;
  password: Password;
};
