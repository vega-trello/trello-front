import {
	Box,
	Button,
	Dialog,
	Flex,
	For,
	IconButton,
	Text,
} from "@chakra-ui/react";
import type { Role, UUID } from "../shared/api/openapi/components/schemas";
import { createAlertDialog, errorMessage, toaster, useTitle } from "../shared";
import { Loader } from "./loader";
import { ErrorAlert } from "./error-alert";
import { useCreateRole, useDeleteRole, useRoles } from "../entities/role";
import { useCallback, type PropsWithChildren } from "react";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

const deleteDialog = createAlertDialog({
	title: "Вы уверены?",
	body: "Удалить роль можно только при отсутствии учатсников с такой ролью",
});

type RoleEditProps = {
	role: Role;
} & PropsWithChildren;
function RoleEdit({ role, children }: RoleEditProps) {
	return (
		<Dialog.Root key={`role-${role.id}`}>
			<Dialog.ActionTrigger asChild>{children}</Dialog.ActionTrigger>
		</Dialog.Root>
	);
}

type RoleElementProps = {
	role: Role;
};
function RoleElement({ role }: RoleElementProps) {
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
			<Text>{role.name}</Text>
			{role.project_uuid !== undefined && (
				<Box>
					<RoleEdit role={role}>
						<IconButton variant="ghost">
							<HiOutlinePencilAlt />
						</IconButton>
					</RoleEdit>
					<IconButton
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
	const { data: roles, isLoading, isError, error } = useRoles(projectUUID);
	const createRole = useCreateRole();
	useTitle("Роли");

	const handleCreate = useCallback(() => {
		createRole.mutate(
			{
				name: "Новая роль",
				permission_ids: [],
				projectUUID,
			},
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [createRole, projectUUID]);

	if (isLoading) return <Loader size="xl" />;
	if (isError) return <ErrorAlert error={error} />;
	if (roles === undefined) return <>Что-то пошло не так</>;

	return (
		<Box display="flex" justifyContent="center" padding="8">
			<deleteDialog.Viewport />
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
						colorScheme="blue"
						onClick={handleCreate}
						loading={createRole.isPending}
					>
						+ Добавить роль
					</Button>
				</Flex>

				<Box display="flex" flexDirection="column" gap="2">
					<For each={roles}>{(r) => <RoleElement role={r} />}</For>
				</Box>
			</Box>
		</Box>
	);
}
