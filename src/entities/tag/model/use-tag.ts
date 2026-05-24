import { API, QueryKeys } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { useApiQuery } from "../../../shared";

export const useTags = (projectUUID: UUID) =>
	useApiQuery(
		API.Project.Tags.GetAll,
		200,
		{ projectUUID },
		{
			queryKey: QueryKeys.tags(projectUUID),
		},
	);
