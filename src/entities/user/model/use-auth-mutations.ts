import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Auth.Login, 200, {
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: QueryKeys.self }),
	});
};

export const useLogout = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Auth.Logout, 200, {
		onSuccess: () => {
			queryClient.setQueryData(QueryKeys.self, null);
			queryClient.removeQueries({
				predicate: (query) => query.queryKey !== QueryKeys.self,
			});
		},
	});
};

export const useRegister = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Auth.Register, 201, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QueryKeys.self });
		},
	});
};
