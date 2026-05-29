import { API, QueryKeys, useApiQuery } from "../../../shared";
import { HTTP } from "../../../shared/api/status";

export const usePermissions = () =>
	useApiQuery(
		API.Permissions.GetAll,
		HTTP.OK,
		{},
		{ queryKey: QueryKeys.permissions },
	);
