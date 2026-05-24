import { API, QueryKeys } from "../../../shared";
import { useApiQuery } from "../../../shared/model/use-api-query";

export const useProjects = () =>
	useApiQuery(
		API.Project.GetAll,
		200,
		{},
		{
			queryKey: QueryKeys.projects,
		},
	);

export const useProject = (uuid: string) =>
	useApiQuery(
		API.Project.Get,
		200,
		{ projectUUID: uuid },
		{
			queryKey: QueryKeys.project(uuid),
		},
	);
