import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";
import { HTTP } from "../../../shared/api/status";

export const useCreateRole = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Roles.Create, HTTP.Created, {
		onSuccess: (_, { projectUUID }) => {
			queryClient.invalidateQueries({ queryKey: QueryKeys.roles(projectUUID) });
		},
	});
};

export const useUpdateRole = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Roles.Update, HTTP.OK, {
		onSuccess: (role, { projectUUID, roleID }) => {
			queryClient.setQueryData(QueryKeys.role(projectUUID, roleID), role);
			queryClient.invalidateQueries({ queryKey: QueryKeys.roles(projectUUID) });
		},
	});
};

export const useDeleteRole = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Roles.Delete, HTTP.NoContent, {
		onSuccess: (_, { projectUUID, roleID }) => {
			queryClient.removeQueries({
				queryKey: QueryKeys.role(projectUUID, roleID),
			});
			queryClient.invalidateQueries({ queryKey: QueryKeys.roles(projectUUID) });
		},
	});
};
