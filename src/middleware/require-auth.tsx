import { Navigate, Outlet } from "react-router";
import { useUser } from "../entities/user";
import { Spinner } from "@chakra-ui/react";

export function RequireAuth() {
	const { data: user, isLoading } = useUser();

	if (isLoading) return <Spinner />;
	if (!user) return <Navigate to="/login" replace />;
	return <Outlet />;
}
