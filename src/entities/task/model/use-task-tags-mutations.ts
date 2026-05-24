import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys } from "../../../shared";
import { useApiMutation } from "../../../shared/model/use-api-mutation";

export const useAttachTag = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Tasks.Tags.Create, 204, {
		onSuccess: (_, { projectUUID, taskID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.task(projectUUID, taskID),
			});
		},
	});
};

export const useDetachTag = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Tasks.Tags.Delete, 204, {
		onSuccess: (_, { projectUUID, taskID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.task(projectUUID, taskID),
			});
		},
	});
};
