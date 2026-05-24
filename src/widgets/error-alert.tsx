import { Alert } from "@chakra-ui/react";
import type { Error } from "../shared/api/openapi/components/schemas";
import { errorMessage } from "../shared";

export function ErrorAlert<
	T extends { status: number; body: Error } | { status: number },
>({ error }: { error: T }) {
	const { title, description } = errorMessage(error);
	return (
		<Alert.Root
			status="error"
			maxW="md"
			variant="subtle"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			textAlign="center"
			p={8}
		>
			<Alert.Title mt={4} mb={1} fontSize="lg">
				[{error.status}] {title}
			</Alert.Title>
			{description !== undefined && (
				<Alert.Description maxW="sm">{description}</Alert.Description>
			)}
		</Alert.Root>
	);
}
