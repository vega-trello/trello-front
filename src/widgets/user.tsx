import { useNavigate } from "react-router";
import { useLogout, useSelf } from "../entities/user";
import { Button, Menu, Portal, Spinner, Text } from "@chakra-ui/react";
import { MdAccountCircle } from "react-icons/md";
import { errorMessage, toaster } from "../shared";
import { useCallback } from "react";

export function User() {
	const { data: user, isPending, isError } = useSelf();
	const logout = useLogout();
	const navigate = useNavigate();

	const handleNavigate = useCallback(() => navigate("/account"), [navigate]);
	const handleLogout = useCallback(
		() =>
			logout.mutate(
				{},
				{
					onSuccess: () => navigate("/login"),
					onError: (err) => toaster.error(errorMessage(err)),
				},
			),
		[logout, navigate],
	);

	if (isError) return <></>;
	if (isPending) return <Spinner size="xs" />;
	if (user === undefined) return <>Что-то пошло не так</>;

	return (
		<Menu.Root positioning={{ placement: "bottom-end" }}>
			<Menu.Trigger asChild>
				<Button variant="plain">
					<Text>{user.username}</Text>
					<MdAccountCircle />
				</Button>
			</Menu.Trigger>
			<Portal>
				<Menu.Positioner>
					<Menu.Content>
						<Menu.Item value="account" onClick={handleNavigate}>
							Аккаунт
						</Menu.Item>
						<Menu.Separator />
						<Menu.Item value="quit" onSelect={handleLogout}>
							Выйти
						</Menu.Item>
					</Menu.Content>
				</Menu.Positioner>
			</Portal>
		</Menu.Root>
	);
}
