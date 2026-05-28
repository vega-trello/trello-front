import { API, QueryKeys, useApiQuery } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import { HTTP } from "../../../shared/api/status";

export const useColumn = (id: integer) =>
	useApiQuery(
		API.Project.Columns.Get,
		HTTP.OK,
		{ columnID: id },
		{
			queryKey: QueryKeys.column(id),
		},
	);

export const useColumns = (projectUUID: UUID) =>
	useApiQuery(
		API.Project.Columns.GetAll,
		HTTP.OK,
		{ projectUUID },
		{
			queryKey: QueryKeys.columns(projectUUID),
		},
	);
