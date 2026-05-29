import type { HTTP } from "../../status";
import type {
	ColumnID,
	ProjectUUID,
	RoleID,
	TagID,
	TaskID,
	UserUUID,
} from "../components/parameters";
import type { StatusID } from "../components/parameters/parameters";
import type {
	BadRequest,
	Unauthorized,
	Forbidden,
} from "../components/responses";
import type { EmptyResponse, Response } from "../components/responses/response";
import type {
	SelfUser,
	Project,
	Username,
	Password,
	UpdateUser,
	CreateProject,
	UpdateProject,
	Column,
	UpdateColumn,
	MoveColumn,
	Member,
	UpdateMember,
	CreateMember,
	Task,
	CreateTask,
	UpdateTask,
	Tag,
	CreateTag,
	UpdateTag,
	Assignee,
	CreateAssignee,
	CreateRole,
	UpdateRole,
	Role,
	Permission,
	User,
	Error,
	Status,
	CreateStatus,
	UpdateStatus,
} from "../components/schemas";
import type { CreateColumn } from "../components/schemas/CreateColumn";
import { DELETE, GET, PATCH, POST } from "./rest";

/* ---------------------------------- Auth ---------------------------------- */

export const AuthRegister = POST<
	[],
	{ username: Username; password: Password },
	{
		[HTTP.Created]: Response<User>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Conflict]: Response<Error>;
	}
>("/auth/register");

export const AuthLogin = POST<
	[],
	{ username: Username; password: Password },
	{
		[HTTP.OK]: Response<{ token: string }>;
		[HTTP.Unauthorized]: Unauthorized;
	}
>("/auth/login");

export const AuthLogout = POST<
	[],
	{},
	{
		[HTTP.OK]: EmptyResponse;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
	}
>("/auth/logout");

export const AuthExchange = POST<
	[],
	{ token: string },
	{
		[HTTP.OK]: Response<{ token: string }>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
	}
>("/auth/sso/exchange");

/* ---------------------------------- Self ---------------------------------- */

export const SelfGet = GET<
	[],
	{
		[HTTP.OK]: Response<SelfUser>;
		[HTTP.Unauthorized]: Unauthorized;
	}
>("/self");

export const SelfUpdate = PATCH<
	[],
	UpdateUser,
	{
		[HTTP.OK]: Response<SelfUser>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.Conflict]: Response<Error>;
	}
>("/self");

/* ---------------------------------- User ---------------------------------- */
export const UserGet = GET<
	[UserUUID],
	{
		[HTTP.OK]: Response<User>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/user");

/* --------------------------------- Projects -------------------------------- */

export const ProjectGetAll = GET<
	[],
	{
		[HTTP.OK]: Response<Project[]>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
	}
>("/projects");

export const ProjectCreate = POST<
	[],
	CreateProject,
	{
		[HTTP.Created]: Response<Project>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
	}
>("/projects");

export const ProjectGet = GET<
	[ProjectUUID],
	{
		[HTTP.OK]: Response<Project>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}");

export const ProjectUpdate = PATCH<
	[ProjectUUID],
	UpdateProject,
	{
		[HTTP.OK]: Response<Project>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}");

export const ProjectDelete = DELETE<
	[ProjectUUID],
	{
		[HTTP.NoContent]: EmptyResponse;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}");

/* -------------------------------- Statuses -------------------------------- */

export const StatusesGetAll = GET<
	[ProjectUUID],
	{
		[HTTP.OK]: Response<Status[]>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/statuses");
export const StatusesCreate = POST<
	[ProjectUUID],
	CreateStatus,
	{
		[HTTP.Created]: Response<Status>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
		[HTTP.Conflict]: EmptyResponse;
	}
>("/projects/{projectUUID}/statuses");
export const StatusesGet = GET<
	[ProjectUUID, StatusID],
	{
		[HTTP.OK]: Response<Status>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/statuses/{statusID}");
export const StatusesUpdate = PATCH<
	[ProjectUUID, StatusID],
	UpdateStatus,
	{
		[HTTP.OK]: Response<Status>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/statuses/{statusID}");
export const StatusesDelete = DELETE<
	[ProjectUUID, StatusID],
	{
		[HTTP.NoContent]: EmptyResponse;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
		[HTTP.Conflict]: EmptyResponse;
	}
>("/projects/{projectUUID}/statuses/{statusID}");

/* --------------------------------- Columns -------------------------------- */

export const ColumnGetAll = GET<
	[ProjectUUID],
	{
		[HTTP.OK]: Response<Column[]>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/columns");

export const ColumnCreate = POST<
	[ProjectUUID],
	CreateColumn,
	{
		[HTTP.Created]: Response<Column>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/columns");

export const ColumnGet = GET<
	[ColumnID],
	{
		[HTTP.OK]: Response<Column>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/columns/{columnID}");

export const ColumnUpdate = PATCH<
	[ColumnID],
	UpdateColumn,
	{
		[HTTP.OK]: Response<Column>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/columns/{columnID}");

export const ColumnMove = POST<
	[ColumnID],
	MoveColumn,
	{
		[HTTP.OK]: Response<Column>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/columns/{columnID}/move");

export const ColumnDelete = DELETE<
	[ColumnID],
	{
		[HTTP.NoContent]: EmptyResponse;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/columns/{columnID}");

/* --------------------------------- Members -------------------------------- */

export const MemberGetAll = GET<
	[ProjectUUID],
	{
		[HTTP.OK]: Response<Member[]>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/members");

export const MemberCreate = POST<
	[ProjectUUID],
	CreateMember,
	{
		[HTTP.Created]: Response<Member>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
		[HTTP.Conflict]: EmptyResponse;
	}
>("/projects/{projectUUID}/members");

export const MemberGet = GET<
	[ProjectUUID, UserUUID],
	{
		[HTTP.OK]: Response<Member>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/member");

export const MemberUpdate = PATCH<
	[ProjectUUID, UserUUID],
	UpdateMember,
	{
		[HTTP.OK]: Response<Member>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/member");

export const MemberDelete = DELETE<
	[ProjectUUID, UserUUID],
	{
		[HTTP.NoContent]: EmptyResponse;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/member");

/* ---------------------------------- Tasks --------------------------------- */

export const TaskGetAll = GET<
	[ProjectUUID],
	{
		[HTTP.OK]: Response<Task[]>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/tasks");

export const TaskCreate = POST<
	[ProjectUUID],
	CreateTask,
	{
		[HTTP.Created]: Response<Task>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/tasks");

export const TaskGet = GET<
	[ProjectUUID, TaskID],
	{
		[HTTP.OK]: Response<Task>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/task");

export const TaskUpdate = PATCH<
	[ProjectUUID, TaskID],
	UpdateTask,
	{
		[HTTP.OK]: Response<Task>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/task");

export const TaskDelete = DELETE<
	[ProjectUUID, TaskID],
	{
		[HTTP.NoContent]: EmptyResponse;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/task");

/* ------------------------------- Task Tags -------------------------------- */

export const TaskTagGetAll = GET<
	[ProjectUUID, TaskID],
	{
		[HTTP.OK]: Response<Tag[]>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/task/tags");

export const TaskTagCreate = POST<
	[ProjectUUID, TaskID, TagID],
	{},
	{
		[HTTP.NoContent]: EmptyResponse;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
		[HTTP.Conflict]: EmptyResponse;
	}
>("/projects/{projectUUID}/task/tags");

export const TaskTagDelete = DELETE<
	[ProjectUUID, TaskID, TagID],
	{
		[HTTP.NoContent]: EmptyResponse;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/task/tags");

/* -------------------------------- Assignees ------------------------------- */

export const AssigneeGetAll = GET<
	[ProjectUUID, TaskID],
	{
		[HTTP.OK]: Response<Assignee[]>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/assignees");

export const AssigneeCreate = POST<
	[ProjectUUID, TaskID],
	CreateAssignee,
	{
		[HTTP.Created]: Response<Assignee>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
		[HTTP.Conflict]: EmptyResponse;
	}
>("/projects/{projectUUID}/assignees");

export const AssigneeDelete = DELETE<
	[ProjectUUID, TaskID, UserUUID],
	{
		[HTTP.NoContent]: EmptyResponse;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/assignee");

/* ----------------------------- Project Tags ------------------------------ */

export const TagGetAll = GET<
	[ProjectUUID],
	{
		[HTTP.OK]: Response<Tag[]>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/tag");

export const TagCreate = POST<
	[ProjectUUID],
	CreateTag,
	{
		[HTTP.Created]: Response<Tag>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/tag");

export const TagUpdate = PATCH<
	[ProjectUUID, TagID],
	UpdateTag,
	{
		[HTTP.OK]: Response<Tag>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/tag");

export const TagDelete = DELETE<
	[ProjectUUID, TagID],
	{
		[HTTP.NoContent]: EmptyResponse;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/tag");

/* ---------------------------------- Roles --------------------------------- */

export const RoleGetAll = GET<
	[ProjectUUID],
	{
		[HTTP.OK]: Response<Role[]>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
	}
>("/projects/{projectUUID}/roles");

export const RoleCreate = POST<
	[ProjectUUID],
	CreateRole,
	{
		[HTTP.Created]: Response<Role>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
	}
>("/projects/{projectUUID}/roles");

export const RoleGet = GET<
	[ProjectUUID, RoleID],
	{
		[HTTP.OK]: Response<Role>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/roles/{roleID}");

export const RoleUpdate = PATCH<
	[ProjectUUID, RoleID],
	UpdateRole,
	{
		[HTTP.OK]: Response<Role>;
		[HTTP.BadRequest]: BadRequest;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/roles/{roleID}");

export const RoleDelete = DELETE<
	[ProjectUUID, RoleID],
	{
		[HTTP.NoContent]: EmptyResponse;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
		[HTTP.Conflict]: EmptyResponse;
	}
>("/projects/{projectUUID}/roles/{roleID}");

export const RolePermissionGetAll = GET<
	[ProjectUUID, RoleID],
	{
		[HTTP.OK]: Response<Permission[]>;
		[HTTP.Unauthorized]: Unauthorized;
		[HTTP.Forbidden]: Forbidden;
		[HTTP.NotFound]: EmptyResponse;
	}
>("/projects/{projectUUID}/roles/{roleID}/permissions");

export const PermissionsGetAll = GET<
	[],
	{
		[HTTP.OK]: Response<Permission[]>;
		[HTTP.Unauthorized]: Unauthorized;
	}
>("/projects/permissions");
