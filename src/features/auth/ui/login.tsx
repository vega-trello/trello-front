import {
	Box,
	Button,
	Center,
	Field,
	Heading,
	Input,
	Stack,
} from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router";
import { useCallback, useState } from "react";
import { PasswordInput } from "../../../shared";
import { useUser } from "../../../entities/user";

export function Login() {
	const { user, login: _login } = useUser();
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const login = useCallback(async () => {
		await _login({ username, password });
	}, [username, password, _login]);

	if (user !== null) {
		navigate("/", { replace: true });
		return <></>;
	}
	return (
		<Center flexGrow="1">
			<Box width="320px" maxWidth="100%">
				<Stack>
					<Heading textAlign="center">Вход</Heading>
					<Field.Root>
						<Field.Label>Имя пользователя</Field.Label>
						<Input
							placeholder="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</Field.Root>
					<Field.Root>
						<Field.Label>Пароль</Field.Label>
						<PasswordInput
							placeholder="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Field.Root>
					<span style={{ textAlign: "center" }}>
						Ещё нету аккаунта?{" "}
						<NavLink to="/register">Зарегестрироваться</NavLink>
					</span>
					<Button mt="4" onClick={login}>
						Продолжить
					</Button>
				</Stack>
			</Box>
		</Center>
	);
}
