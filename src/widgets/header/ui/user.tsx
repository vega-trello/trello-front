import { NavLink } from "react-router";
import { useUser } from "../../../entities/user";
import { useCallback } from "react";
import { Button, Menu, Portal, Text } from "@chakra-ui/react";
import { MdAccountCircle } from "react-icons/md";

export function User() {
	const { user, logout } = useUser();

	const quit = useCallback(async () => {
		logout();
	}, [logout]);

	if (user === null) return <></>;
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
						<Menu.Item value="preferences">
							<NavLink to="/preferences">Настройки</NavLink>
						</Menu.Item>
						<Menu.Separator />
						<Menu.Item value="quit" onSelect={quit}>
							Выйти
						</Menu.Item>
					</Menu.Content>
				</Menu.Positioner>
			</Portal>
		</Menu.Root>
	);
}
