import { API, QueryKeys, useApiQuery } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import { HTTP } from "../../../shared/api/status";

export const useAssignees = (projectUUID: UUID, taskID: integer) =>
	useApiQuery(
		API.Project.Assignees.GetAll,
		HTTP.OK,
		{
			projectUUID,
			taskID,
		},
		{ queryKey: QueryKeys.assignees(projectUUID, taskID) },
	);
