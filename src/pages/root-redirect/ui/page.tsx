import { Navigate } from "react-router";
import { useUser } from "../../../entities/user";

export function RootRedirect() {
	const user = useUser();
	if (user === null || user === undefined) return <Navigate to="/login" />;
	return <Navigate to="/projects" replace />;
}
