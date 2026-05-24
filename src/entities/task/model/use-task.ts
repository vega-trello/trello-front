import { API, QueryKeys, useApiQuery } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";

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
			queryKey: QueryKeys.task(taskID),
		},
	);
