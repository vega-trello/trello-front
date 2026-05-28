import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";
import { HTTP } from "../../../shared/api/status";

export const useAddAssignee = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Assignees.Create, HTTP.Created, {
		onSuccess: (_, { projectUUID, taskID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.task(taskID),
			});
			queryClient.invalidateQueries({
				queryKey: QueryKeys.assignees(projectUUID, taskID),
			});
		},
	});
};

export const useRemoveAssignee = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Assignees.Delete, HTTP.NoContent, {
		onSuccess: (_, { projectUUID, taskID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.task(taskID),
			});
			queryClient.invalidateQueries({
				queryKey: QueryKeys.assignees(projectUUID, taskID),
			});
		},
	});
};
