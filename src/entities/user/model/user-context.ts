import { createContext } from "react";
import type { SelfUser } from "../../../shared/api/openapi/components/schemas";
import type {
	Response,
	Unauthorized,
} from "../../../shared/api/openapi/components/responses";

type UserContextType = {
	user: SelfUser | null;
	loading: boolean;
	login: (opts: { username: string; password: string }) => Promise<
		| ({
				status: 401;
		  } & Unauthorized)
		| ({
				status: 200;
		  } & Response<{
				token: string;
		  }>)
	>;
	refetch: () => Promise<void>;
	logout: () => void;
};

export const UserCtx = createContext<UserContextType | null>(null);
