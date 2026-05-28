import { API, QueryKeys, useApiQuery } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { HTTP } from "../../../shared/api/status";

export const useMembers = (projectUUID: UUID) =>
	useApiQuery(
		API.Project.Members.GetAll,
		HTTP.OK,
		{ projectUUID },
		{
			queryKey: QueryKeys.members(projectUUID),
		},
	);

export const useMember = (projectUUID: UUID, userUUID: UUID) =>
	useApiQuery(
		API.Project.Members.Get,
		HTTP.OK,
		{ projectUUID, userUUID },
		{ queryKey: QueryKeys.member(projectUUID, userUUID) },
	);
