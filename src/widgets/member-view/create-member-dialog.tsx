import {
	Button,
	createListCollection,
	Dialog,
	HStack,
	Input,
	Portal,
	Select,
} from "@chakra-ui/react";
import type { Role, UUID } from "../../shared/api/openapi/components/schemas";
import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import { useRoles } from "../../entities/role";
import { ErrorAlert } from "../error-alert";
import { Loader } from "../loader";
import { useCreateMember } from "../../entities/member/model/use-member-mutations";
import { errorMessage, toaster } from "../../shared";

export type CreateMemberDialogProps = {
	projectUUID: UUID;
} & PropsWithChildren;

export function CreateMemberDialog({
	projectUUID,
	children,
}: CreateMemberDialogProps) {
	const { data: roles, isPending, isError, error } = useRoles(projectUUID);
	const [uuid, setUUID] = useState("");
	const [role, setRole] = useState<string | undefined>(undefined);
	const createMember = useCreateMember();

	const collection = useMemo(
		() =>
			createListCollection<Role>({
				items: roles ?? [],
				itemToValue: (s) => s.id.toString(),
				itemToString: (s) => s.name,
			}),
		[roles],
	);

	const handleCreate = useCallback(() => {
		if (role === undefined) {
			toaster.error({
				title: "Ошибка",
				description: "Роль не выбрана",
			});
			return;
		}
		const roleID = parseInt(role);
		createMember.mutate(
			{
				projectUUID,
				role_id: roleID,
				user_uuid: uuid,
			},
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [uuid, role, projectUUID, createMember]);

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
							<Dialog.Title>Добавление участника</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<HStack>
								<Input
									value={uuid}
									onChange={(e) => setUUID(e.target.value)}
									placeholder="UUID пользователя"
								/>
								<Select.Root
									collection={collection}
									value={role !== undefined ? [role] : []}
									onValueChange={(e) => setRole(e.value.at(0))}
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
								<Button loading={createMember.isPending} onClick={handleCreate}>
									Добавить
								</Button>
							</Dialog.ActionTrigger>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}
