import {
	useState,
	useEffect,
	type PropsWithChildren,
	useCallback,
} from "react";
import type { SelfUser } from "../../../shared/api/openapi/components/schemas";
import { API } from "../../../shared";
import { UserCtx } from "../model/user-context";

export function UserProvider({ children }: PropsWithChildren) {
	const [user, setUser] = useState<SelfUser | null>(null);
	const [loading, setLoading] = useState(true);

	const refetch = async () => {
		const res = await API.User.GetSelf({});
		if (res.status === 200) setUser(res.body);
		else setUser(null);
	};

	const login = useCallback(
		async ({ username, password }: { username: string; password: string }) => {
			const res = await API.Auth.Login({ username, password });
			if (res.status === 200) {
				const self = await API.User.GetSelf({});
				if (self.status === 200) setUser(self.body);
			}
			return res;
		},
		[setUser],
	);

	const logout = () => {
		API.Auth.Logout({});
		setUser(null);
	};

	useEffect(() => {
		setTimeout(() => refetch().finally(() => setLoading(false)));
	}, []);

	return (
		<UserCtx value={{ user, loading, refetch, logout, login }}>{children}</UserCtx>
	);
}
