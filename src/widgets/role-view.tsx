import { Box } from "@chakra-ui/react";
import type { UUID } from "../shared/api/openapi/components/schemas";
import { useTitle } from "../shared";

export function RoleView({ projectUUID }: { projectUUID: UUID }) {
	useTitle("Роли");

	return (
		<Box display="flex" flexDirection="column" padding="2" gap="4">
			{projectUUID}
		</Box>
	);
}
