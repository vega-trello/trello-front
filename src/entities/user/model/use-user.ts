import { useContext } from "react";
import { UserCtx } from "./user-context";

export function useUser() {
	const ctx = useContext(UserCtx);
	if (ctx === null) throw new Error("useUser must be used inside <UserProvider>");
	return ctx;
}
