import type { Nullable } from "./nullable";
import type { Password } from "./password";
import type { Username } from "./username";

export type UpdateUser = {
	username: Nullable<Username>;
	password: Nullable<Password>;
};
