import {
	Box,
	Button,
	Center,
	Field,
	Heading,
	Input,
	Stack,
} from "@chakra-ui/react";
import { NavLink } from "react-router";
import { useState } from "react";
import { PasswordInput } from "../../../shared";
import { useLogin } from "../../../entities/user";

export function Login() {
	const login = useLogin();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	return (
		<Center flexGrow="1">
			<Box width="320px" maxWidth="100%">
				<Stack>
					<Heading textAlign="center">Вход</Heading>
					<form
						style={{ display: "contents" }}
						onSubmit={() => login.mutate({ username, password })}
					>
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
						<Button mt="4" type="submit">
							Продолжить
						</Button>
					</form>
				</Stack>
			</Box>
		</Center>
	);
}
