import { API, QueryKeys, useApiQuery } from "../../../shared";
import { HTTP } from "../../../shared/api/status";

export const useSelf = () =>
	useApiQuery(
		API.Self.Get,
		HTTP.OK,
		{},
		{
			retry: 0,
			queryKey: QueryKeys.self,
		},
	);
