import { API, QueryKeys, useApiQuery } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";

export const useColumn = (id: integer) =>
	useApiQuery(
		API.Project.Columns.Get,
		200,
		{ columnID: id },
		{
			queryKey: QueryKeys.column(id),
		},
	);

export const useColumns = (projectUUID: UUID) =>
	useApiQuery(
		API.Project.Columns.GetAll,
		200,
		{ projectUUID },
		{
			queryKey: QueryKeys.columns(projectUUID),
		},
	);
