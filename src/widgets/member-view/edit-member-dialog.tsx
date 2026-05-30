import {
	Button,
	createListCollection,
	Dialog,
	HStack,
	Portal,
	Select,
} from "@chakra-ui/react";
import type { Member, Role } from "../../shared/api/openapi/components/schemas";
import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import { useRoles } from "../../entities/role";
import { ErrorAlert } from "../error-alert";
import { Loader } from "../loader";
import { useUpdateMember } from "../../entities/member/model/use-member-mutations";
import { errorMessage, toaster } from "../../shared";

export type EditMemberDialogProps = {
	member: Member;
} & PropsWithChildren;

export function EditMemberDialog({ member, children }: EditMemberDialogProps) {
	const {
		data: roles,
		isPending,
		isError,
		error,
	} = useRoles(member.project_uuid);
	const [role, setRole] = useState<string>(member.role_id.toString());
	const updateMember = useUpdateMember();

	const collection = useMemo(
		() =>
			createListCollection<Role>({
				items: roles ?? [],
				itemToValue: (s) => s.id.toString(),
				itemToString: (s) => s.name,
			}),
		[roles],
	);

	const handleUpdate = useCallback(() => {
		const roleID = parseInt(role);
		updateMember.mutate(
			{
				projectUUID: member.project_uuid,
				userUUID: member.uuid,
				role_id: roleID,
			},
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [member, role, updateMember]);

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Loader size="lg" />;

	return (
		<Dialog.Root key="create-member">
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Portal>
				<Dialog.Positioner>
					<Dialog.Backdrop />
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>
								Изменение роли участника {member.username}
							</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<HStack>
								<Select.Root
									collection={collection}
									value={role !== undefined ? [role] : []}
									onValueChange={(e) =>
										e.value[0] !== undefined && setRole(e.value[0])
									}
								>
									<Select.HiddenSelect />
									<Select.Control>
										<Select.Trigger>
											<Select.ValueText placeholder="Роль" />
										</Select.Trigger>
										<Select.IndicatorGroup>
											<Select.Indicator />
										</Select.IndicatorGroup>
									</Select.Control>
									<Portal>
										<Select.Positioner>
											<Select.Content>
												{collection.items.map((role) => (
													<Select.Item item={role} key={role.name}>
														{role.name}
														<Select.ItemIndicator />
													</Select.Item>
												))}
											</Select.Content>
										</Select.Positioner>
									</Portal>
								</Select.Root>
							</HStack>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button loading={updateMember.isPending} onClick={handleUpdate}>
									Сохранить
								</Button>
							</Dialog.ActionTrigger>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}
