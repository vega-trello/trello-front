import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";
import { HTTP } from "../../../shared/api/status";

export const useCreateStatus = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Statuses.Create, HTTP.Created, {
		onSuccess: (_, { projectUUID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.statuses(projectUUID),
			});
		},
	});
};

export const useUpdateStatus = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Statuses.Update, HTTP.OK, {
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

	return useApiMutation(API.Project.Statuses.Delete, HTTP.NoContent, {
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
