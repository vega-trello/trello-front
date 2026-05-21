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
import { API, PasswordInput } from "../../../shared";
import { useState } from "react";

export function Register() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const register = async () => {
		const res = await API.Auth.Register({ username, password });
		if (res.status === 201) {
			return navigate("/");
		}
	};

	return (
		<Center flexGrow="1">
			<Box width="320px" maxWidth="100%">
				<Stack>
					<Heading textAlign="center">Регистрация</Heading>
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
						Уже есть аккаунт? <NavLink to="/login">Войти</NavLink>
					</span>
					<Button mt="4" type="button" onClick={register}>
						Продолжить
					</Button>
				</Stack>
			</Box>
		</Center>
	);
}
