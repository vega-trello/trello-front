import { API, QueryKeys } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { useApiQuery } from "../../../shared";
import { HTTP } from "../../../shared/api/status";

export const useTags = (projectUUID: UUID) =>
	useApiQuery(
		API.Project.Tags.GetAll,
		HTTP.OK,
		{ projectUUID },
		{
			queryKey: QueryKeys.tags(projectUUID),
		},
	);
