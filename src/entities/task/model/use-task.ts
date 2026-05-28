import { API, QueryKeys, useApiQuery } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import { HTTP } from "../../../shared/api/status";

export const useTasks = (projectUUID: UUID) =>
	useApiQuery(
		API.Project.Tasks.GetAll,
		HTTP.OK,
		{ projectUUID },
		{
			queryKey: QueryKeys.tasks(projectUUID),
		},
	);

export const useTask = (projectUUID: UUID, taskID: integer) =>
	useApiQuery(
		API.Project.Tasks.Get,
		HTTP.OK,
		{ projectUUID, taskID },
		{
			queryKey: QueryKeys.task(taskID),
		},
	);
