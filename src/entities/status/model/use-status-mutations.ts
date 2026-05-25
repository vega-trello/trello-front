import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";

export const useCreateStatus = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Statuses.Create, 201, {
		onSuccess: (_, { projectUUID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.statuses(projectUUID),
			});
		},
	});
};

export const useUpdateStatus = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Statuses.Update, 200, {
		onSuccess: (status, { projectUUID, statusID }) => {
			queryClient.setQueryData(QueryKeys.status(projectUUID, statusID), status);
			queryClient.invalidateQueries({
				queryKey: QueryKeys.status(projectUUID, statusID),
			});
			queryClient.invalidateQueries({
				queryKey: QueryKeys.statuses(projectUUID),
			});
		},
	});
};

export const useDeleteStatus = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Statuses.Delete, 204, {
		onSuccess: (_, { statusID, projectUUID }) => {
			queryClient.removeQueries({
				queryKey: QueryKeys.status(projectUUID, statusID),
			});
			queryClient.invalidateQueries({
				queryKey: QueryKeys.status(projectUUID, statusID),
			});
			queryClient.invalidateQueries({
				queryKey: QueryKeys.statuses(projectUUID),
			});
		},
	});
};
