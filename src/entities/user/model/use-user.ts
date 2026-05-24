import { API, QueryKeys, useApiQuery } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";

export const useUser = (userUUID: UUID) =>
	useApiQuery(
		API.User.Get,
		200,
		{ userUUID },
		{
			queryKey: QueryKeys.user(userUUID),
		},
	);
