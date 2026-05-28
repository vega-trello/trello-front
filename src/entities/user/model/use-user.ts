import { API, QueryKeys, useApiQuery } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { HTTP } from "../../../shared/api/status";

export const useUser = (userUUID: UUID) =>
	useApiQuery(
		API.User.Get,
		HTTP.OK,
		{ userUUID },
		{
			queryKey: QueryKeys.user(userUUID),
		},
	);
