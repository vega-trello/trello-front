import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";
import { HTTP } from "../../../shared/api/status";

export const useAttachTag = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Tasks.Tags.Create, HTTP.NoContent, {
		onSuccess: (_, { taskID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.task(taskID),
			});
		},
	});
};

export const useDetachTag = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Tasks.Tags.Delete, HTTP.NoContent, {
		onSuccess: (_, { taskID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.task(taskID),
			});
		},
	});
};
