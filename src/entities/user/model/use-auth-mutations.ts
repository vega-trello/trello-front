import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys } from "../../../shared";
import { useApiMutation } from "../../../shared/model/use-api-mutation";

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
