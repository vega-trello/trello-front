import { Button } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useExchange } from "../../../entities/user/model/use-auth-mutations";
import { errorMessage, toaster } from "../../../shared";

async function fetchSessionToken(): Promise<string | null> {
	const res = await fetch(
		"https://vegastage.ru/authservice.php?op=getsessiontoken",
		{ credentials: "include" },
	);
	const data = await res.json();
	return data.token ?? null;
}

export function SSOButton() {
	const [polling, setPolling] = useState(false);
	const popupRef = useRef<Window | null>(null);
	const exchange = useExchange();

	const handleExchange = useCallback(
		(token: string) => {
			exchange.mutate(
				{
					token,
				},
				{
					onError: (err) => toaster.error(errorMessage(err)),
				},
			);
		},
		[exchange],
	);

	const {
		data: token,
		isLoading,
		isSuccess,
	} = useQuery({
		queryKey: ["sso-session-token"],
		queryFn: fetchSessionToken,
		enabled: polling,
		retry: 5,
		refetchInterval: (query) => {
			if (query.state.data) return false;
			return 1500;
		},
	});

	useEffect(() => {
		if (!isSuccess) return;

		setTimeout(() => setPolling(false));
		popupRef.current?.close();
		handleExchange(token!);
	}, [token, isSuccess, handleExchange]);

	const handleAuth = useCallback(async () => {
		popupRef.current = window.open(
			"https://vegastage.ru/auth_session/login.php",
			"sso-login",
			"width=500,height=600,menubar=no,toolbar=no,location=no",
		);
		setPolling(true);
	}, []);

	return (
		<Button
			type="button"
			onClick={handleAuth}
			colorPalette="blue"
			loading={isLoading}
		>
			Вход через Vega SSO
		</Button>
	);
}
