import { tokenStorage } from "../../tokenStorage";
import type {
	ColumnID,
	ProjectUUID,
	RoleID,
	TagID,
	TaskID,
	UserUUID,
} from "../components/parameters";
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
} from "../components/schemas";
import type { CreateColumn } from "../components/schemas/CreateColumn";
import { DELETE, GET, PATCH, POST } from "./rest";

/* ---------------------------------- Auth ---------------------------------- */

export const AuthRegister = POST<
	[],
	{ username: Username; password: Password },
	{
		201: Response<User>;
		400: BadRequest;
		409: Response<Error>;
	}
>("/auth/register");

const _Login = POST<
	[],
	{ username: Username; password: Password },
	{
		200: Response<{ token: string }>;
		401: Unauthorized;
	}
>("/auth/login");

export const AuthLogin = (
	username: Username,
	password: Password,
	signal?: AbortSignal,
) => {
	return _Login({}, {}, { username, password }, signal).then((res) => {
		if (res.status === 200) {
			tokenStorage.set(res.body.token);
		}
		return res;
	});
};

export const AuthLogout = POST<
	[],
	{},
	{
		200: EmptyResponse;
		401: Unauthorized;
	}
>("/auth/logout");

/* ---------------------------------- Self ---------------------------------- */

export const SelfGet = GET<
	[],
	{
		200: Response<SelfUser>;
		401: Unauthorized;
	}
>("/self");

export const SelfUpdate = PATCH<
	[],
	UpdateUser,
	{
		200: Response<SelfUser>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
	}
>("/self");

/* ---------------------------------- User ---------------------------------- */
export const UserGet = GET<
	[UserUUID],
	{
		200: Response<User>;
		401: Unauthorized;
		404: EmptyResponse;
	}
>("/user");

/* --------------------------------- Projects -------------------------------- */

export const ProjectGetAll = GET<
	[],
	{
		200: Response<Project[]>;
		401: Unauthorized;
		403: Forbidden;
	}
>("/projects");

export const ProjectCreate = POST<
	[],
	CreateProject,
	{
		201: Response<Project>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
	}
>("/projects");

export const ProjectGet = GET<
	[ProjectUUID],
	{
		200: Response<Project>;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}");

export const ProjectUpdate = PATCH<
	[ProjectUUID],
	UpdateProject,
	{
		200: Response<Project>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}");

export const ProjectDelete = DELETE<
	[ProjectUUID],
	{
		204: EmptyResponse;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}");

/* --------------------------------- Columns -------------------------------- */

export const ColumnGetAll = GET<
	[ProjectUUID],
	{
		200: Response<Column[]>;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/columns");

export const ColumnCreate = POST<
	[ProjectUUID],
	CreateColumn,
	{
		201: Response<Column>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/columns");

export const ColumnGet = GET<
	[ColumnID],
	{
		200: Response<Column>;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/columns/{columnID}");

export const ColumnUpdate = PATCH<
	[ColumnID],
	UpdateColumn,
	{
		200: Response<Column>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/columns/{columnID}");

export const ColumnMove = POST<
	[ColumnID],
	MoveColumn,
	{
		200: Response<Column>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/columns/{columnID}/move");

export const ColumnDelete = DELETE<
	[ColumnID],
	{
		204: EmptyResponse;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/columns/{columnID}");

/* --------------------------------- Members -------------------------------- */

export const MemberGetAll = GET<
	[ProjectUUID],
	{
		200: Response<Member[]>;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/members");

export const MemberCreate = POST<
	[ProjectUUID],
	CreateMember,
	{
		201: Response<Member>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
		409: EmptyResponse;
	}
>("/projects/{projectUUID}/members");

export const MemberGet = GET<
	[ProjectUUID, UserUUID],
	{
		200: Response<Member>;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/member");

export const MemberUpdate = PATCH<
	[ProjectUUID, UserUUID],
	UpdateMember,
	{
		200: Response<Member>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/member");

export const MemberDelete = DELETE<
	[ProjectUUID, UserUUID],
	{
		204: EmptyResponse;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/member");

/* ---------------------------------- Tasks --------------------------------- */

export const TaskGetAll = GET<
	[ProjectUUID],
	{
		200: Response<Task[]>;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/tasks");

export const TaskCreate = POST<
	[ProjectUUID],
	CreateTask,
	{
		201: Response<Task>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/tasks");

export const TaskGet = GET<
	[ProjectUUID, TaskID],
	{
		200: Response<Task>;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/task");

export const TaskUpdate = PATCH<
	[ProjectUUID, TaskID],
	UpdateTask,
	{
		200: Response<Task>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/task");

export const TaskDelete = DELETE<
	[ProjectUUID, TaskID],
	{
		204: EmptyResponse;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/task");

/* ------------------------------- Task Tags -------------------------------- */

export const TaskTagGetAll = GET<
	[TaskID],
	{
		200: Response<Tag[]>;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/task/tags");

export const TaskTagCreate = POST<
	[TaskID, TagID],
	{},
	{
		204: EmptyResponse;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
		409: EmptyResponse;
	}
>("/projects/{projectUUID}/task/tags");

export const TaskTagDelete = DELETE<
	[TaskID, TagID],
	{
		204: EmptyResponse;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/task/tags");

/* -------------------------------- Assignees ------------------------------- */

export const AssigneeGetAll = GET<
	[ProjectUUID, TaskID],
	{
		200: Response<Assignee[]>;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/assignees");

export const AssigneeCreate = POST<
	[ProjectUUID, TaskID],
	CreateAssignee,
	{
		201: Response<Assignee>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
		409: EmptyResponse;
	}
>("/projects/{projectUUID}/assignees");

export const AssigneeDelete = DELETE<
	[ProjectUUID, TaskID, UserUUID],
	{
		204: EmptyResponse;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/assignee");

/* ----------------------------- Project Tags ------------------------------ */

export const TagGetAll = GET<
	[ProjectUUID],
	{
		200: Response<Tag[]>;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/tag");

export const TagCreate = POST<
	[ProjectUUID],
	CreateTag,
	{
		201: Response<Tag>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/tag");

export const TagUpdate = PATCH<
	[ProjectUUID, TagID],
	UpdateTag,
	{
		200: Response<Tag>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/tag");

export const TagDelete = DELETE<
	[ProjectUUID, TagID],
	{
		204: EmptyResponse;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/tag");

/* ---------------------------------- Roles --------------------------------- */

export const RoleGetAll = GET<
	[ProjectUUID],
	{
		200: Response<Role[]>;
		401: Unauthorized;
		403: Forbidden;
	}
>("/projects/{projectUUID}/roles");

export const RoleCreate = POST<
	[ProjectUUID],
	CreateRole,
	{
		201: Response<Role>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
	}
>("/projects/{projectUUID}/roles");

export const RoleGet = GET<
	[ProjectUUID, RoleID],
	{
		200: Response<Role>;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/roles/{roleID}");

export const RoleUpdate = PATCH<
	[ProjectUUID, RoleID],
	UpdateRole,
	{
		200: Response<Role>;
		400: BadRequest;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/roles/{roleID}");

export const RoleDelete = DELETE<
	[ProjectUUID, RoleID],
	{
		204: EmptyResponse;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
		409: EmptyResponse;
	}
>("/projects/{projectUUID}/roles/{roleID}");

export const RolePermissionGetAll = GET<
	[ProjectUUID, RoleID],
	{
		200: Response<Permission[]>;
		401: Unauthorized;
		403: Forbidden;
		404: EmptyResponse;
	}
>("/projects/{projectUUID}/roles/{roleID}/permissions");
