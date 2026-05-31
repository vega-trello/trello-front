import { Box, Button, Flex, For, IconButton, Text } from "@chakra-ui/react";
import type { Role, UUID } from "../shared/api/openapi/components/schemas";
import { createAlertDialog, errorMessage, toaster, useTitle } from "../shared";
import { Loader } from "./loader";
import { ErrorAlert } from "./error-alert";
import { useCreateRole, useDeleteRole, useRoles } from "../entities/role";
import { useCallback } from "react";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { editRoleDialog } from "../entities/role/ui/edit-role-dialog";

const deleteDialog = createAlertDialog({
	title: "Вы уверены?",
	body: "Удалить роль можно только при отсутствии учатсников с такой ролью",
});

type RoleElementProps = {
	projectUUID: UUID;
	role: Role;
};
function RoleElement({ projectUUID, role }: RoleElementProps) {
	const deleteRole = useDeleteRole();
	const handleDelete = useCallback(() => {
		deleteRole.mutate(
			{
				projectUUID: role.project_uuid!,
				roleID: role.id,
			},
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [deleteRole, role]);

	return (
		<Box display="flex" alignItems="center" justifyContent="space-between">
			<Flex flexDirection="column" gap={0} flex={1} cursor="pointer" as="label">
				<Text>{role.name}</Text>
				{role.description && (
					<Text fontSize="xs" color="gray.500">
						{role.description}
					</Text>
				)}
			</Flex>
			{role.project_uuid !== null && (
				<Box>
					<IconButton
						variant="ghost"
						onClick={() =>
							editRoleDialog.open("role-edit", {
								projectUUID,
								role,
							})
						}
					>
						<HiOutlinePencilAlt />
					</IconButton>
					<IconButton
						loading={deleteRole.isPending}
						variant="ghost"
						colorPalette="red"
						onClick={() =>
							deleteDialog.open("delete-role", { callback: handleDelete })
						}
					>
						<HiOutlineTrash />
					</IconButton>
				</Box>
			)}
		</Box>
	);
}

export function RoleView({ projectUUID }: { projectUUID: UUID }) {
	const { data: roles, isPending, isError, error } = useRoles(projectUUID);
	const createRole = useCreateRole();
	useTitle("Роли");

	const handleCreate = useCallback(() => {
		createRole.mutate(
			{
				name: "Новая роль",
				description: null,
				permission_ids: [],
				projectUUID,
			},
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [createRole, projectUUID]);

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Loader size="xl" />;

	return (
		<Box display="flex" justifyContent="center" padding="8">
			<deleteDialog.Viewport />
			<editRoleDialog.Viewport />
			<Box w="100%" maxW="640px" display="flex" flexDirection="column" gap="6">
				<Flex justify="space-between" align="center">
					<Box>
						<Text fontWeight="semibold" fontSize="lg">
							Роли
						</Text>
						<Text fontSize="sm" color="gray.500">
							Ролей в проекте: {roles.length}
						</Text>
					</Box>
					<Button
						size="sm"
						onClick={handleCreate}
						loading={createRole.isPending}
					>
						+ Добавить роль
					</Button>
				</Flex>

				<Box display="flex" flexDirection="column" gap="3">
					<For each={roles}>
						{(r) => (
							<RoleElement key={r.id} projectUUID={projectUUID} role={r} />
						)}
					</For>
				</Box>
			</Box>
		</Box>
	);
}
