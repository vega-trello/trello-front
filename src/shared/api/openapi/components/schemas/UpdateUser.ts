import type { Password } from "./password";
import type { Username } from "./username";

export type UpdateUser = {
	username?: Username;
	password?: Password;
};
