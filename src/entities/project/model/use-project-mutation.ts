import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";
import { HTTP } from "../../../shared/api/status";

export const useCreateProject = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Create, HTTP.Created, {
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: QueryKeys.projects }),
	});
};

export const useUpdateProject = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Update, HTTP.OK, {
		onSuccess: (updatedProject, { projectUUID }) => {
			queryClient.setQueryData(QueryKeys.project(projectUUID), updatedProject);
			queryClient.invalidateQueries({ queryKey: QueryKeys.projects });
		},
	});
};

export const useDeleteProject = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Delete, HTTP.NoContent, {
		onSuccess: (_, { projectUUID }) => {
			queryClient.removeQueries({ queryKey: QueryKeys.project(projectUUID) });
			queryClient.invalidateQueries({ queryKey: QueryKeys.projects });
		},
	});
};
