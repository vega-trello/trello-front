import { Box, Button, Flex, For, Text } from "@chakra-ui/react";
import type { UUID } from "../../shared/api/openapi/components/schemas";
import { useTitle } from "../../shared";
import { useMembers } from "../../entities/member/model/use-member";
import { Loader } from "../loader";
import { ErrorAlert } from "../error-alert";
import { MemberElement } from "./member-element";
import { deleteDialog } from "./delete-dialog";
import { CreateMemberDialog } from "./create-member-dialog";

export function MemberView({ projectUUID }: { projectUUID: UUID }) {
	const { data: members, isPending, isError, error } = useMembers(projectUUID);
	useTitle("Участники");

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Loader size="xl" />;

	return (
		<Box display="flex" justifyContent="center" padding="8">
			<deleteDialog.Viewport />
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
					<CreateMemberDialog projectUUID={projectUUID}>
						<Button size="sm">+ Добавить участника</Button>
					</CreateMemberDialog>
				</Flex>

				<Box display="flex" flexDirection="column" gap="2">
					<For each={members}>
						{(m) => <MemberElement key={m.uuid} member={m} />}
					</For>
				</Box>
			</Box>
		</Box>
	);
}
