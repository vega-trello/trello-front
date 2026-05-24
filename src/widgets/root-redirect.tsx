import { Spinner } from "@chakra-ui/react";
import { useSelf } from "../entities/user";
import { Navigate } from "react-router";

export function RootRedirect() {
	const { data: user, isLoading } = useSelf();
	if (isLoading) return <Spinner />;
	if (user === undefined) return <Navigate to="/login" />;
	return <Navigate to="/projects" />;
}
