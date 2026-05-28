import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys } from "../../../shared";
import { useApiMutation } from "../../../shared/model/use-api-mutation";
import { HTTP } from "../../../shared/api/status";

export const useAddMember = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Members.Create, HTTP.Created, {
		onSuccess: (_, { projectUUID }) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.members(projectUUID),
			});
		},
	});
};

export const useUpdateMember = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Members.Update, HTTP.OK, {
		onSuccess: (member, { userUUID, projectUUID }) => {
			queryClient.setQueryData(QueryKeys.member(projectUUID, userUUID), member);
			queryClient.invalidateQueries({
				queryKey: QueryKeys.members(projectUUID),
			});
		},
	});
};

export const useRemoveMember = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Members.Delete, HTTP.NoContent, {
		onSuccess: (_, { userUUID, projectUUID }) => {
			queryClient.removeQueries({
				queryKey: QueryKeys.member(projectUUID, userUUID),
			});
			queryClient.invalidateQueries({
				queryKey: QueryKeys.members(projectUUID),
			});
			queryClient.invalidateQueries({ queryKey: QueryKeys.tasks(projectUUID) });
		},
	});
};
