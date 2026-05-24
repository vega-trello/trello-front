import { Navigate } from "react-router";
import { useSelf } from "../../../entities/user";

export function RootRedirect() {
	const user = useSelf();
	if (user === null || user === undefined) return <Navigate to="/login" />;
	return <Navigate to="/projects" replace />;
}
