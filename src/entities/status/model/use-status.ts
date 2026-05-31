import { API, QueryKeys } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { useApiQuery } from "../../../shared";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import { HTTP } from "../../../shared/api/status";

export const useStatuses = (projectUUID: UUID) =>
	useApiQuery(
		API.Project.Statuses.GetAll,
		HTTP.OK,
		{ projectUUID },
		{
			queryKey: QueryKeys.statuses(projectUUID),
		},
	);

export const useStatus = (projectUUID: UUID, statusID: integer | null) =>
	useApiQuery(
		API.Project.Statuses.Get,
		HTTP.OK,
		{ projectUUID, statusID: statusID ?? -1 },
		{
			queryKey: QueryKeys.status(projectUUID, statusID ?? -1),
			enabled: statusID !== null,
		},
	);
