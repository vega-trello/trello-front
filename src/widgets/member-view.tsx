import { Box, Button, Flex, For, Text } from "@chakra-ui/react";
import type { UUID } from "../shared/api/openapi/components/schemas";
import { useTitle } from "../shared";
import { useMembers } from "../entities/member/model/use-member";
import { Loader } from "./loader";
import { ErrorAlert } from "./error-alert";

export function MemberView({ projectUUID }: { projectUUID: UUID }) {
	const { data: members, isLoading, isError, error } = useMembers(projectUUID);
	useTitle("Участники");

	if (isLoading) return <Loader size="xl" />;
	if (isError) return <ErrorAlert error={error} />;
	if (members === undefined) return <>Что-то пошло не так</>;

	return (
		<Box display="flex" justifyContent="center" padding="8">
			<Box w="100%" maxW="640px" display="flex" flexDirection="column" gap="6">
				<Flex justify="space-between" align="center">
					<Box>
						<Text fontWeight="semibold" fontSize="lg">
							Участники
						</Text>
						<Text fontSize="sm" color="gray.500">
							Участников в проекте: {members.length}
						</Text>
					</Box>
					<Button size="sm" colorScheme="blue">
						+ Добавить участника
					</Button>
				</Flex>

				<Box display="flex" flexDirection="column" gap="2">
					<For each={members}>{(m) => <>{m.username}</>}</For>
				</Box>
			</Box>
		</Box>
	);
}
