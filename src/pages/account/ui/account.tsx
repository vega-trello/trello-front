import {
	Box,
	Button,
	Clipboard,
	Dialog,
	Field,
	Flex,
	IconButton,
	Input,
	Portal,
	Stack,
	Text,
} from "@chakra-ui/react";
import { errorMessage, toaster, useTitle } from "../../../shared";
import { useSelf } from "../../../entities/user";
import { ErrorAlert, Loader } from "../../../widgets";
import { createFormDialog } from "../../../shared/ui/form-dialog";
import { useUpdateSelf } from "../../../entities/user/model/use-user-mutations";
import { useCallback, useState, type PropsWithChildren } from "react";
import type {
	SelfUser,
	UpdateUser,
} from "../../../shared/api/openapi/components/schemas";

const updateDialog = createFormDialog<{
	username: "";
	password: "";
	old_password: "";
}>({
	title: "Изменить пользователя",
	fields: {
		username: {
			type: "text",
			label: "Новое имя",
			placeholder: "Оставтье пустым чтобы не менять",
		},
		password: {
			type: "password",
			label: "Новый пароль",
			placeholder: "Оставтье пустым чтобы не менять",
		},
		old_password: {
			type: "password",
			label: "Текущий пароль",
			placeholder: "Введите текущий пароль для подтверждения",
		},
	},
});

function UpdateDialog({
	user,
	children,
}: { user: SelfUser } & PropsWithChildren) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const updateSelf = useUpdateSelf();

	const handleUpdate = useCallback(() => {
		const update: UpdateUser = {};
		if (username.length !== 0) update.username = username;
		if (password.length !== 0 && user.user_type === "manual")
			update.password = password;

		updateSelf.mutate(update, {
			onSuccess: () =>
				toaster.success({
					title: "Успешно",
					description:
						"username" in update && "password" in update
							? "Имя и пароль изменены"
							: "username" in update
								? "Имя изменено"
								: "password" in update
									? "Пароль изменён"
									: undefined,
				}),
			onError: (err) => toaster.error(errorMessage(err)),
		});
	}, [username, password, user, updateSelf]);

	return (
		<Dialog.Root
			onOpenChange={(e) => {
				if (!e.open) {
					setPassword("");
					setUsername("");
				}
			}}
		>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Изменить пользователя</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Stack gap="4">
								<Field.Root>
									<Field.Label>Имя</Field.Label>
									<Input
										placeholder="Оставтье пустым чтобы не изменять"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
									/>
								</Field.Root>
								{user.user_type === "manual" && (
									<Field.Root>
										<Field.Label>Пароль</Field.Label>
										<Input
											placeholder="Оставтье пустым чтобы не изменять"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
									</Field.Root>
								)}
							</Stack>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button onClick={handleUpdate} loading={updateSelf.isPending}>
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

export function Page() {
	const { data: user, isPending, isError, error } = useSelf();
	useTitle("Аккаунт");

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Loader size="lg" />;

	return (
		<Box display="flex" justifyContent="center" padding="8">
			<updateDialog.Viewport />
			<Box w="100%" maxW="640px" display="flex" flexDirection="column" gap="6">
				<Field.Root>
					<Field.Label>Идентификатор пользователя</Field.Label>
					<Flex wrap="nowrap" alignItems="center" gap="1">
						<Text fontFamily="mono">{user.uuid}</Text>
						<Clipboard.Root value={user.uuid}>
							<Clipboard.Trigger asChild>
								<IconButton variant="outline" size="xs">
									<Clipboard.Indicator />
								</IconButton>
							</Clipboard.Trigger>
						</Clipboard.Root>
					</Flex>
				</Field.Root>
				<Field.Root>
					<Field.Label>Имя пользователя</Field.Label>
					<Text>{user.username}</Text>
				</Field.Root>
				<Field.Root>
					<Field.Label>Дата создания</Field.Label>
					<Text>{new Date(user.created_at).toLocaleString()}</Text>
				</Field.Root>
				<Field.Root>
					<Field.Label>Тип пользователя</Field.Label>
					<Text>{user.user_type === "manual" ? "Обычный" : "Привязаный"}</Text>
				</Field.Root>
				<Box display="flex" justifyContent="flex-end">
					<UpdateDialog user={user}>
						<Button>Изменить</Button>
					</UpdateDialog>
				</Box>
			</Box>
		</Box>
	);
}
