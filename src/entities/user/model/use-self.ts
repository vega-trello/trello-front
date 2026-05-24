import { API, QueryKeys, useApiQuery } from "../../../shared";

export const useSelf = () =>
	useApiQuery(API.Self.Get, 200, {}, { queryKey: QueryKeys.self });
