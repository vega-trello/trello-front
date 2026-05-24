import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys } from "../../../shared";
import { useApiMutation } from "../../../shared/model/use-api-mutation";

export const useAddAssignee = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Assignees.Create, 201, {
		onSuccess: (_, { projectUUID, taskID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.task(projectUUID, taskID),
			});
		},
	});
};

export const useRemoveAssignee = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Assignees.Delete, 204, {
		onSuccess: (_, { projectUUID, taskID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.task(projectUUID, taskID),
			});
		},
	});
};
