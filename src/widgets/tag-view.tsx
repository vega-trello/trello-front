import { Box } from "@chakra-ui/react";
import type { UUID } from "../shared/api/openapi/components/schemas";
import { useTitle } from "../shared";

export function TagView({ projectUUID }: { projectUUID: UUID }) {
	useTitle("Тэги");

	return (
		<Box display="flex" flexDirection="column" padding="2" gap="4">
			{projectUUID}
		</Box>
	);
}
