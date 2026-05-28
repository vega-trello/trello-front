import { Navigate, Outlet } from "react-router";
import { useSelf } from "../entities/user";
import { Spinner } from "@chakra-ui/react";
import { useEffect } from "react";

export function RequireGuest() {
	const { data: user, isLoading } = useSelf();

	if (isLoading) return <Spinner />;
	if (user) return <Navigate to="/projects" replace />;
	return <Outlet />;
}
