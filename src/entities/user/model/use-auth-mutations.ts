import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";
import { tokenStorage } from "../../../shared/api/token-storage";
import { HTTP } from "../../../shared/api/status";

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Auth.Login, HTTP.OK, {
		onSuccess: ({ token }) => {
			tokenStorage.set(token);
			queryClient.invalidateQueries({ queryKey: QueryKeys.self });
		},
	});
};

export const useLogout = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Auth.Logout, HTTP.OK, {
		onSuccess: () => {
			tokenStorage.clear();
			queryClient.clear();
		},
	});
};

export const useRegister = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Auth.Register, HTTP.Created, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QueryKeys.self });
		},
	});
};

export const useExchange = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Auth.Exchange, HTTP.OK, {
		onSuccess: ({ token }) => {
			tokenStorage.set(token);
			queryClient.invalidateQueries({ queryKey: QueryKeys.self });
		},
	});
};
