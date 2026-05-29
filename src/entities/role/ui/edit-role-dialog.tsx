import {
	useCallback,
	useEffect,
	useState,
	type PropsWithChildren,
} from "react";
import type {
	Permission,
	Role,
	UUID,
} from "../../../shared/api/openapi/components/schemas";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import {
	Button,
	createOverlay,
	Dialog,
	Field,
	For,
	Input,
	Portal,
	Separator,
	Stack,
	Text,
} from "@chakra-ui/react";
import { usePermissions } from "../../permission/model/use-permission";
import { useRolePermissions } from "../model/use-role";
import { ErrorAlert, Loader } from "../../../widgets";
import { useUpdateRole } from "../model/use-role-mutations";
import { errorMessage, toaster } from "../../../shared";
import { PermissionRow } from "./permission-row";

type EditRoleDialogProps = {
	projectUUID: UUID;
	role: Role;
} & PropsWithChildren;

export const editRoleDialog = createOverlay<EditRoleDialogProps>(
	({ projectUUID, role, children, ...rest }) => {
		const {
			data: allPermissions,
			isPending: isPend1,
			isError: isErr1,
			error: err1,
		} = usePermissions();

		const {
			data: initPerms,
			isPending: isPend2,
			isError: isErr2,
			error: err2,
		} = useRolePermissions(projectUUID, role.id);

		const [enabledIds, setEnabledIds] = useState<Set<integer>>(new Set());
		const [name, setName] = useState("");
		const [desc, setDesc] = useState("");

		useEffect(() => {
			(async () => {
				if (initPerms) setEnabledIds(new Set(initPerms.map((p) => p.id)));
			})();
		}, [initPerms]);

		useEffect(() => {
			(async () => {
				if (role) {
					setName(role.name);
					setDesc(role.description ?? "");
				}
			})();
		}, [role]);

		const togglePermission = useCallback((id: integer) => {
			setEnabledIds((prev) => {
				const next = new Set(prev);
				if (next.has(id)) {
					next.delete(id);
				} else {
					next.add(id);
				}
				return next;
			});
		}, []);

		const updateRole = useUpdateRole();

		const handleUpdate = useCallback(() => {
			updateRole.mutate(
				{
					projectUUID,
					roleID: role.id,
					name,
					description: desc,
					permission_ids: [...enabledIds],
				},
				{
					onError: (err) => toaster.error(errorMessage(err)),
				},
			);
		}, [projectUUID, role, name, desc, enabledIds, updateRole]);

		if (isErr1 || isErr2)
			return (
				<Stack>
					{err1 && <ErrorAlert error={err1} />}
					{err2 && <ErrorAlert error={err2} />}
				</Stack>
			);

		if (isPend1 || isPend2) return <Loader size="md" />;

		const projectPerms = allPermissions.filter((p) =>
			[
				"view_project",
				"manage_project",
				"manage_members",
				"manage_roles",
			].includes(p.name),
		);

		const contentPerms = allPermissions.filter((p) =>
			[
				"manage_columns",
				"manage_tasks",
				"manage_statuses",
				"manage_tags",
				"manage_assignees",
			].includes(p.name),
		);

		return (
			<Dialog.Root {...rest} key={`role-edit-${role.id}`}>
				<Dialog.Trigger asChild>{children}</Dialog.Trigger>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Редактирование роли {role.name}</Dialog.Title>
							</Dialog.Header>

							<Dialog.Body>
								<Stack gap={4}>
									<Field.Root>
										<Field.Label>Название</Field.Label>
										<Input
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
									</Field.Root>

									<Field.Root>
										<Field.Label>Описание</Field.Label>
										<Input
											value={desc}
											onChange={(e) => setDesc(e.target.value)}
										/>
									</Field.Root>

									<Separator />

									<Text
										fontWeight={500}
										fontSize="xs"
										textTransform="uppercase"
										letterSpacing="wider"
										color="gray.400"
									>
										Проект
									</Text>
									<For each={projectPerms}>
										{(perm: Permission) => (
											<PermissionRow
												key={perm.id}
												permission={perm}
												checked={enabledIds.has(perm.id)}
												onToggle={togglePermission}
											/>
										)}
									</For>

									<Separator />

									<Text
										fontWeight={500}
										fontSize="xs"
										textTransform="uppercase"
										letterSpacing="wider"
										color="gray.400"
									>
										Содержимое
									</Text>
									<For each={contentPerms}>
										{(perm: Permission) => (
											<PermissionRow
												key={perm.id}
												permission={perm}
												checked={enabledIds.has(perm.id)}
												onToggle={togglePermission}
											/>
										)}
									</For>
								</Stack>
							</Dialog.Body>

							<Dialog.Footer>
								<Dialog.ActionTrigger asChild>
									<Button loading={updateRole.isPending} onClick={handleUpdate}>
										Сохранить
									</Button>
								</Dialog.ActionTrigger>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		);
	},
);
