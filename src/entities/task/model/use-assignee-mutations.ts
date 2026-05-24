import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";

export const useAddAssignee = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Assignees.Create, 201, {
		onSuccess: (_, { taskID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.task(taskID),
			});
		},
	});
};

export const useRemoveAssignee = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Assignees.Delete, 204, {
		onSuccess: (_, { taskID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.task(taskID),
			});
		},
	});
};
