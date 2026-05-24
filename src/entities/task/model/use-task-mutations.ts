import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";

export const useCreateTask = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Tasks.Create, 201, {
		onSuccess: (_, { projectUUID }) => {
			queryClient.invalidateQueries({ queryKey: QueryKeys.tasks(projectUUID) });
		},
	});
};

export const useUpdateTask = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Tasks.Update, 200, {
		onSuccess: (task, { projectUUID, taskID }) => {
			queryClient.setQueryData(QueryKeys.task(taskID), task);
			queryClient.invalidateQueries({ queryKey: QueryKeys.tasks(projectUUID) });
		},
	});
};

export const useDeleteTask = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Tasks.Delete, 204, {
		onSuccess: (_, { taskID, projectUUID }) => {
			queryClient.removeQueries({
				queryKey: QueryKeys.task(taskID),
			});
			queryClient.invalidateQueries({ queryKey: QueryKeys.tasks(projectUUID) });
		},
	});
};
