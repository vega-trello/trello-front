import { Navigate, Outlet } from "react-router";
import { useUser } from "../entities/user";
import { Spinner } from "@chakra-ui/react";

function RequireAuth() {
	const { user, loading } = useUser();

	if (loading) return <Spinner />;
	if (!loading && user === null) return <Navigate to="/login" replace />;

	return <Outlet />;
}

export default RequireAuth;
