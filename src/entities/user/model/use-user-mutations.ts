import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";
import { HTTP } from "../../../shared/api/status";

export const useUpdateSelf = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Self.Update, HTTP.OK, {
		onSuccess: (user) => {
			queryClient.setQueryData(QueryKeys.self, user);
		},
	});
};
