import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { useApiMutation } from "../../../shared/model/use-api-mutation";

export const useCreateProject = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Create, 201, {
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: QueryKeys.projects }),
	});
};

export const useUpdateProject = (projectUUID: UUID) => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Update, 200, {
		onSuccess: (updatedProject) => {
			queryClient.setQueryData(QueryKeys.project(projectUUID), updatedProject);
			queryClient.invalidateQueries({ queryKey: QueryKeys.projects });
		},
	});
};

export const useDeleteProject = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Delete, 204, {
		onSuccess: (_, { projectUUID }) => {
			queryClient.removeQueries({ queryKey: QueryKeys.project(projectUUID) });
			queryClient.invalidateQueries({ queryKey: QueryKeys.projects });
		},
	});
};
