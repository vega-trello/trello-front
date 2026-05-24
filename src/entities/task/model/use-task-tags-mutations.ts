import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";

export const useAttachTag = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Tasks.Tags.Create, 204, {
		onSuccess: (_, { taskID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.task(taskID),
			});
		},
	});
};

export const useDetachTag = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Tasks.Tags.Delete, 204, {
		onSuccess: (_, { taskID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.task(taskID),
			});
		},
	});
};
