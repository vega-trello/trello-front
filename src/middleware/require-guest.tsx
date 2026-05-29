import { Navigate, Outlet } from "react-router";
import { useSelf } from "../entities/user";
import { Spinner } from "@chakra-ui/react";

export function RequireGuest() {
	const { data: user, isPending } = useSelf();

	if (isPending) return <Spinner />;
	if (user) return <Navigate to="/projects" replace />;
	return <Outlet />;
}
