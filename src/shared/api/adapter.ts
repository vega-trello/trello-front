import type {
	BadRequest,
	Unauthorized,
	Forbidden,
	Response,
	EmptyResponse,
} from "./openapi/components/responses";
import type {
	Assignee,
	Column,
	CreateAssignee,
	CreateMember,
	CreateProject,
	CreateRole,
	CreateTag,
	Member,
	Password,
	Permission,
	Project,
	Role,
	SelfUser,
	Tag,
	Task,
	CreateTask,
	UpdateColumn,
	UpdateMember,
	UpdateProject,
	UpdateRole,
	UpdateTag,
	UpdateTask,
	UpdateUser,
	CreateColumn,
	User,
	Username,
	UUID,
	Error,
	MoveColumn,
	CreateStatus,
	Status,
	UpdateStatus,
} from "./openapi/components/schemas";
import type { integer } from "./openapi/components/schemas/integer";
import type { HTTP } from "./status";

type Responses<T extends { [K in number]: Response<unknown> }> = Promise<
	{
		[K in keyof T]: {
			status: K;
		} & (T[K] extends { body: undefined } ? {} : T[K]);
	}[keyof T]
>;

export type APIAdapter = {
	Auth: {
		Register: (
			req: { username: Username; password: Password },
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.Created]: Response<User>;
			[HTTP.BadRequest]: BadRequest;
			[HTTP.Conflict]: Response<Error>;
		}>;

		Login: (
			req: { username: Username; password: Password },
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.OK]: Response<{ token: string }>;
			[HTTP.Unauthorized]: Unauthorized;
		}>;

		Logout: (
			req: {},
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.OK]: EmptyResponse;
			[HTTP.Unauthorized]: Unauthorized;
			[HTTP.Forbidden]: Forbidden;
		}>;

		Exchange: (
			req: { token: string },
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.OK]: Response<{ token: string }>;
			[HTTP.BadRequest]: BadRequest;
			[HTTP.Unauthorized]: Unauthorized;
		}>;
	};

	Self: {
		Get: (
			req: {},
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.OK]: Response<SelfUser>;
			[HTTP.Unauthorized]: Unauthorized;
			[HTTP.Forbidden]: Forbidden;
		}>;

		Update: (
			req: UpdateUser,
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.OK]: Response<SelfUser>;
			[HTTP.BadRequest]: BadRequest;
			[HTTP.Unauthorized]: Unauthorized;
			[HTTP.Forbidden]: Forbidden;
			[HTTP.Conflict]: Response<Error>;
		}>;
	};

	User: {
		Get: (
			req: { userUUID: UUID },
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.OK]: Response<User>;
			[HTTP.Unauthorized]: Unauthorized;
			[HTTP.NotFound]: EmptyResponse;
		}>;
	};

	Project: {
		GetAll: (
			req: {},
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.OK]: Response<Project[]>;
			[HTTP.Unauthorized]: Unauthorized;
			[HTTP.Forbidden]: Forbidden;
		}>;

		Create: (
			req: CreateProject,
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.Created]: Response<Project>;
			[HTTP.BadRequest]: BadRequest;
			[HTTP.Unauthorized]: Unauthorized;
			[HTTP.Forbidden]: Forbidden;
		}>;

		Get: (
			req: { projectUUID: UUID },
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.OK]: Response<Project>;
			[HTTP.Unauthorized]: Unauthorized;
			[HTTP.Forbidden]: Forbidden;
			[HTTP.NotFound]: EmptyResponse;
		}>;

		Update: (
			req: { projectUUID: UUID } & UpdateProject,
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.OK]: Response<Project>;
			[HTTP.BadRequest]: BadRequest;
			[HTTP.Unauthorized]: Unauthorized;
			[HTTP.Forbidden]: Forbidden;
			[HTTP.NotFound]: EmptyResponse;
		}>;

		Delete: (
			req: { projectUUID: UUID },
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.NoContent]: EmptyResponse;
			[HTTP.Unauthorized]: Unauthorized;
			[HTTP.Forbidden]: Forbidden;
			[HTTP.NotFound]: EmptyResponse;
		}>;

		Columns: {
			GetAll: (
				req: { projectUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Column[]>;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Create: (
				req: { projectUUID: UUID } & CreateColumn,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.Created]: Response<Column>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Get: (
				req: { columnID: integer },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Column>;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Update: (
				req: { columnID: integer } & UpdateColumn,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Column>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Move: (
				req: { columnID: integer } & MoveColumn,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Column>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Delete: (
				req: { columnID: integer },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.NoContent]: EmptyResponse;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;
		};

		Statuses: {
			GetAll: (
				req: { projectUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Status[]>;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;
			Create: (
				req: { projectUUID: UUID } & CreateStatus,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.Created]: Response<Status>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
				[HTTP.Conflict]: EmptyResponse;
			}>;
			Get: (
				req: { projectUUID: UUID; statusID: integer },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Status>;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;
			Update: (
				req: { projectUUID: UUID; statusID: integer } & UpdateStatus,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Status>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;
			Delete: (
				req: { projectUUID: UUID; statusID: integer },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.NoContent]: EmptyResponse;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
				[HTTP.Conflict]: EmptyResponse;
			}>;
		};

		Members: {
			GetAll: (
				req: { projectUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Member[]>;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Create: (
				req: { projectUUID: UUID } & CreateMember,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.Created]: Response<Member>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
				[HTTP.Conflict]: EmptyResponse;
			}>;

			Get: (
				req: { projectUUID: UUID; userUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Member>;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Update: (
				req: { projectUUID: UUID; userUUID: UUID } & UpdateMember,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Member>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Delete: (
				req: { projectUUID: UUID; userUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.NoContent]: EmptyResponse;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;
		};

		Tasks: {
			GetAll: (
				req: { projectUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Task[]>;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Create: (
				req: { projectUUID: UUID } & CreateTask,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.Created]: Response<Task>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Get: (
				req: { projectUUID: UUID; taskID: integer },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Task>;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Update: (
				req: { projectUUID: UUID; taskID: integer } & UpdateTask,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Task>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Move: (
				req: { projectUUID: UUID; taskID: integer; column_id: integer },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Task>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Delete: (
				req: { projectUUID: UUID; taskID: integer },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.NoContent]: EmptyResponse;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Tags: {
				GetAll: (
					req: { projectUUID: UUID; taskID: integer },
					signal?: AbortSignal,
				) => Responses<{
					[HTTP.OK]: Response<Tag[]>;
					[HTTP.Unauthorized]: Unauthorized;
					[HTTP.Forbidden]: Forbidden;
					[HTTP.NotFound]: EmptyResponse;
				}>;

				Create: (
					req: { projectUUID: UUID; taskID: integer; tagID: integer },
					signal?: AbortSignal,
				) => Responses<{
					[HTTP.NoContent]: EmptyResponse;
					[HTTP.Unauthorized]: Unauthorized;
					[HTTP.Forbidden]: Forbidden;
					[HTTP.NotFound]: EmptyResponse;
					[HTTP.Conflict]: EmptyResponse;
				}>;

				Delete: (
					req: {
						projectUUID: UUID;
						taskID: integer;
						tagID: integer;
					},
					signal?: AbortSignal,
				) => Responses<{
					[HTTP.NoContent]: EmptyResponse;
					[HTTP.Unauthorized]: Unauthorized;
					[HTTP.Forbidden]: Forbidden;
					[HTTP.NotFound]: EmptyResponse;
				}>;
			};
		};

		Assignees: {
			GetAll: (
				req: { projectUUID: UUID; taskID: integer },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Assignee[]>;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Create: (
				req: { projectUUID: UUID; taskID: integer } & CreateAssignee,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.Created]: Response<Assignee>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
				[HTTP.Conflict]: EmptyResponse;
			}>;

			Delete: (
				req: {
					projectUUID: UUID;
					taskID: integer;
					userUUID: UUID;
				},
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.NoContent]: EmptyResponse;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;
		};

		Tags: {
			GetAll: (
				req: { projectUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Tag[]>;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Create: (
				req: { projectUUID: UUID } & CreateTag,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.Created]: Response<Tag>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Update: (
				req: { projectUUID: UUID; tagID: integer } & UpdateTag,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Tag>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Delete: (
				req: { projectUUID: UUID; tagID: integer },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.NoContent]: EmptyResponse;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;
		};

		Roles: {
			GetAll: (
				req: { projectUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Role[]>;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
			}>;

			Create: (
				req: { projectUUID: UUID } & CreateRole,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.Created]: Response<Role>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
			}>;

			Get: (
				req: { projectUUID: UUID; roleID: integer },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Role>;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Update: (
				req: { projectUUID: UUID; roleID: integer } & UpdateRole,
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.OK]: Response<Role>;
				[HTTP.BadRequest]: BadRequest;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
			}>;

			Delete: (
				req: { projectUUID: UUID; roleID: integer },
				signal?: AbortSignal,
			) => Responses<{
				[HTTP.NoContent]: EmptyResponse;
				[HTTP.Unauthorized]: Unauthorized;
				[HTTP.Forbidden]: Forbidden;
				[HTTP.NotFound]: EmptyResponse;
				[HTTP.Conflict]: EmptyResponse;
			}>;

			Permissions: {
				GetAll: (
					req: { projectUUID: UUID; roleID: integer },
					signal?: AbortSignal,
				) => Responses<{
					[HTTP.OK]: Response<Permission[]>;
					[HTTP.Unauthorized]: Unauthorized;
					[HTTP.Forbidden]: Forbidden;
					[HTTP.NotFound]: EmptyResponse;
				}>;
			};
		};
	};

	Permissions: {
		GetAll: (
			req: {},
			signal?: AbortSignal,
		) => Responses<{
			[HTTP.OK]: Response<Permission[]>;
			[HTTP.Unauthorized]: Unauthorized;
		}>;
	};
};
