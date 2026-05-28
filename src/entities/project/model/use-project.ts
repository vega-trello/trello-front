import { API, QueryKeys } from "../../../shared";
import { useApiQuery } from "../../../shared";
import { HTTP } from "../../../shared/api/status";

export const useProjects = () =>
	useApiQuery(
		API.Project.GetAll,
		HTTP.OK,
		{},
		{
			queryKey: QueryKeys.projects,
		},
	);

export const useProject = (uuid: string) =>
	useApiQuery(
		API.Project.Get,
		HTTP.OK,
		{ projectUUID: uuid },
		{
			queryKey: QueryKeys.project(uuid),
		},
	);
