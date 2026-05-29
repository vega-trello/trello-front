import { API, QueryKeys, useApiQuery } from "../../../shared";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import { HTTP } from "../../../shared/api/status";

export const useRoles = (projectUUID: UUID) =>
	useApiQuery(
		API.Project.Roles.GetAll,
		HTTP.OK,
		{ projectUUID },
		{ queryKey: QueryKeys.roles(projectUUID) },
	);

export const useRole = (projectUUID: UUID, roleID: integer) =>
	useApiQuery(
		API.Project.Roles.Get,
		HTTP.OK,
		{ projectUUID, roleID },
		{ queryKey: QueryKeys.role(projectUUID, roleID) },
	);

export const useRolePermissions = (projectUUID: UUID, roleID: integer) =>
	useApiQuery(
		API.Project.Roles.Permissions.GetAll,
		HTTP.OK,
		{ projectUUID, roleID },
		{ queryKey: QueryKeys.rolePermissions(projectUUID, roleID) },
	);
