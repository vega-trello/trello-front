import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";

export const useCreateTag = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Tags.Create, 201, {
		onSuccess: (_, { projectUUID }) => {
			queryClient.invalidateQueries({ queryKey: QueryKeys.tags(projectUUID) });
		},
	});
};

export const useUpdateTag = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Tags.Update, 200, {
		onSuccess: (tag, { projectUUID, tagID }) => {
			queryClient.setQueryData(QueryKeys.tag(projectUUID, tagID), tag);
			queryClient.invalidateQueries({ queryKey: QueryKeys.tags(projectUUID) });
			queryClient.invalidateQueries({ queryKey: QueryKeys.tasks(projectUUID) });
		},
	});
};

export const useDeleteTag = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Tags.Delete, 204, {
		onSuccess: (_, { tagID, projectUUID }) => {
			queryClient.removeQueries({
				queryKey: QueryKeys.tag(projectUUID, tagID),
			});
			queryClient.invalidateQueries({ queryKey: QueryKeys.tags(projectUUID) });
			queryClient.invalidateQueries({ queryKey: QueryKeys.tasks(projectUUID) });
		},
	});
};
