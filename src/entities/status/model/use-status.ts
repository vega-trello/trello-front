import { API, QueryKeys } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { useApiQuery } from "../../../shared";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";

export const useStatuses = (projectUUID: UUID) =>
	useApiQuery(
		API.Project.Statuses.GetAll,
		200,
		{ projectUUID },
		{
			queryKey: QueryKeys.statuses(projectUUID),
		},
	);

export const useStatus = (projectUUID: UUID, statusID: integer) =>
	useApiQuery(
		API.Project.Statuses.Get,
		200,
		{ projectUUID, statusID },
		{
			queryKey: QueryKeys.status(projectUUID, statusID),
		},
	);
