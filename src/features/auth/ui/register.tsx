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
import { errorMessage, PasswordInput, toaster } from "../../../shared";
import { useCallback, useState } from "react";
import { useRegister } from "../../../entities/user";

export function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const register = useRegister();
	const navigate = useNavigate();

	const handleRegister = useCallback(() => {
		register.mutate(
			{ username, password },
			{
				onSuccess: () => {
					toaster.success({
						title: "Регистрация успешна",
						description: "Теперь войдите в аккаунт",
					});
					navigate("/login");
				},
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [register, username, password, navigate]);

	return (
		<Center flexGrow="1">
			<Box width="320px" maxWidth="100%">
				<Stack>
					<Heading textAlign="center">Регистрация</Heading>
					<form
						style={{ display: "contents" }}
						onSubmit={(e) => {
							e.preventDefault();
							handleRegister();
						}}
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
							Уже есть аккаунт? <NavLink to="/login">Войти</NavLink>
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
