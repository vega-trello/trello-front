import { API, QueryKeys, useApiQuery } from "../../../shared";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";

export const useTaskTags = (taskID: integer) =>
	useApiQuery(
		API.Project.Tasks.Tags.GetAll,
		200,
		{ taskID },
		{
			queryKey: QueryKeys.taskTags(taskID),
		},
	);
