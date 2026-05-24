import { useQueryClient } from "@tanstack/react-query";
import { API, QueryKeys, useApiMutation } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";

export const useCreateColumn = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Columns.Create, 201, {
		onSuccess: (column) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.columns(column.project_uuid),
			});
		},
	});
};

export const useUpdateColumn = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Columns.Update, 200, {
		onSuccess: (column) => {
			queryClient.setQueryData(QueryKeys.column(column.id), column);
			queryClient.invalidateQueries({
				queryKey: QueryKeys.columns(column.project_uuid),
			});
		},
	});
};

export const useMoveColumn = () => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Columns.Move, 200, {
		onSuccess: (column) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.columns(column.project_uuid),
			});
		},
	});
};

export const useDeleteColumn = (projectUUID: UUID) => {
	const queryClient = useQueryClient();

	return useApiMutation(API.Project.Columns.Delete, 204, {
		onSuccess: (_, { columnID }) => {
			queryClient.removeQueries({ queryKey: QueryKeys.column(columnID) });
			queryClient.invalidateQueries({
				queryKey: QueryKeys.columns(projectUUID),
			});
		},
	});
};
