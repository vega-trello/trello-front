import { API, QueryKeys } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import { useApiQuery } from "../../../shared/model/use-api-query";

export const useTasks = (projectUUID: UUID) =>
	useApiQuery(
		API.Project.Tasks.GetAll,
		200,
		{ projectUUID },
		{
			queryKey: QueryKeys.tasks(projectUUID),
		},
	);

export const useTask = (projectUUID: UUID, taskID: integer) =>
	useApiQuery(
		API.Project.Tasks.Get,
		200,
		{ projectUUID, taskID },
		{
			queryKey: QueryKeys.task(projectUUID, taskID),
		},
	);
