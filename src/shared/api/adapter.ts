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
			201: Response<User>;
			400: BadRequest;
			409: Response<Error>;
		}>;

		Login: (
			req: { username: Username; password: Password },
			signal?: AbortSignal,
		) => Responses<{
			200: Response<{ token: string }>;
			401: Unauthorized;
		}>;

		Logout: (
			req: {},
			signal?: AbortSignal,
		) => Responses<{
			200: EmptyResponse;
			401: Unauthorized;
		}>;
	};

	Self: {
		Get: (
			req: {},
			signal?: AbortSignal,
		) => Responses<{
			200: Response<SelfUser>;
			401: Unauthorized;
		}>;

		Update: (
			req: UpdateUser,
			signal?: AbortSignal,
		) => Responses<{
			200: Response<SelfUser>;
			400: BadRequest;
			401: Unauthorized;
			403: Forbidden;
		}>;
	};

	User: {
		Get: (
			req: { userUUID: UUID },
			signal?: AbortSignal,
		) => Responses<{
			200: Response<User>;
			401: Unauthorized;
			404: EmptyResponse;
		}>;
	};

	Project: {
		GetAll: (
			req: {},
			signal?: AbortSignal,
		) => Responses<{
			200: Response<Project[]>;
			401: Unauthorized;
			403: Forbidden;
		}>;

		Create: (
			req: CreateProject,
			signal?: AbortSignal,
		) => Responses<{
			201: Response<Project>;
			400: BadRequest;
			401: Unauthorized;
			403: Forbidden;
		}>;

		Get: (
			req: { projectUUID: UUID },
			signal?: AbortSignal,
		) => Responses<{
			200: Response<Project>;
			401: Unauthorized;
			403: Forbidden;
			404: EmptyResponse;
		}>;

		Update: (
			req: { projectUUID: UUID } & UpdateProject,
			signal?: AbortSignal,
		) => Responses<{
			200: Response<Project>;
			400: BadRequest;
			401: Unauthorized;
			403: Forbidden;
			404: EmptyResponse;
		}>;

		Delete: (
			req: { projectUUID: UUID },
			signal?: AbortSignal,
		) => Responses<{
			204: EmptyResponse;
			401: Unauthorized;
			403: Forbidden;
			404: EmptyResponse;
		}>;

		Columns: {
			GetAll: (
				req: { projectUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Column[]>;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Create: (
				req: { projectUUID: UUID } & CreateColumn,
				signal?: AbortSignal,
			) => Responses<{
				201: Response<Column>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Get: (
				req: { columnID: integer },
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Column>;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Update: (
				req: { columnID: integer } & UpdateColumn,
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Column>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Move: (
				req: { columnID: integer } & MoveColumn,
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Column>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Delete: (
				req: { columnID: integer },
				signal?: AbortSignal,
			) => Responses<{
				204: EmptyResponse;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;
		};

		Statuses: {
			GetAll: (
				req: { projectUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Status[]>;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;
			Create: (
				req: { projectUUID: UUID } & CreateStatus,
				signal?: AbortSignal,
			) => Responses<{
				201: Response<Status>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
				409: EmptyResponse;
			}>;
			Get: (
				req: { projectUUID: UUID; statusID: integer },
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Status>;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;
			Update: (
				req: { projectUUID: UUID; statusID: integer } & UpdateStatus,
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Status>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;
			Delete: (
				req: { projectUUID: UUID; statusID: integer },
				signal?: AbortSignal,
			) => Responses<{
				204: EmptyResponse;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
				409: EmptyResponse;
			}>;
		};

		Members: {
			GetAll: (
				req: { projectUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Member[]>;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Create: (
				req: { projectUUID: UUID } & CreateMember,
				signal?: AbortSignal,
			) => Responses<{
				201: Response<Member>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
				409: EmptyResponse;
			}>;

			Get: (
				req: { projectUUID: UUID; userUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Member>;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Update: (
				req: { projectUUID: UUID; userUUID: UUID } & UpdateMember,
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Member>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Delete: (
				req: { projectUUID: UUID; userUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				204: EmptyResponse;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;
		};

		Tasks: {
			GetAll: (
				req: { projectUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Task[]>;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Create: (
				req: { projectUUID: UUID } & CreateTask,
				signal?: AbortSignal,
			) => Responses<{
				201: Response<Task>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Get: (
				req: { projectUUID: UUID; taskID: integer },
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Task>;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Update: (
				req: { projectUUID: UUID; taskID: integer } & UpdateTask,
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Task>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Delete: (
				req: { projectUUID: UUID; taskID: integer },
				signal?: AbortSignal,
			) => Responses<{
				204: EmptyResponse;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Tags: {
				GetAll: (
					req: { taskID: integer },
					signal?: AbortSignal,
				) => Responses<{
					200: Response<Tag[]>;
					401: Unauthorized;
					403: Forbidden;
					404: EmptyResponse;
				}>;

				Create: (
					req: { taskID: integer; tagID: integer },
					signal?: AbortSignal,
				) => Responses<{
					204: EmptyResponse;
					401: Unauthorized;
					403: Forbidden;
					404: EmptyResponse;
					409: EmptyResponse;
				}>;

				Delete: (
					req: {
						taskID: integer;
						tagID: integer;
					},
					signal?: AbortSignal,
				) => Responses<{
					204: EmptyResponse;
					401: Unauthorized;
					403: Forbidden;
					404: EmptyResponse;
				}>;
			};
		};

		Assignees: {
			GetAll: (
				req: { projectUUID: UUID; taskID: integer },
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Assignee[]>;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Create: (
				req: { projectUUID: UUID; taskID: integer } & CreateAssignee,
				signal?: AbortSignal,
			) => Responses<{
				201: Response<Assignee>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
				409: EmptyResponse;
			}>;

			Delete: (
				req: {
					projectUUID: UUID;
					taskID: integer;
					userUUID: UUID;
				},
				signal?: AbortSignal,
			) => Responses<{
				204: EmptyResponse;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;
		};

		Tags: {
			GetAll: (
				req: { projectUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Tag[]>;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Create: (
				req: { projectUUID: UUID } & CreateTag,
				signal?: AbortSignal,
			) => Responses<{
				201: Response<Tag>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Update: (
				req: { projectUUID: UUID; tagID: integer } & UpdateTag,
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Tag>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Delete: (
				req: { projectUUID: UUID; tagID: integer },
				signal?: AbortSignal,
			) => Responses<{
				204: EmptyResponse;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;
		};

		Roles: {
			GetAll: (
				req: { projectUUID: UUID },
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Role[]>;
				401: Unauthorized;
				403: Forbidden;
			}>;

			Create: (
				req: { projectUUID: UUID } & CreateRole,
				signal?: AbortSignal,
			) => Responses<{
				201: Response<Role>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
			}>;

			Get: (
				req: { projectUUID: UUID; roleID: integer },
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Role>;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Update: (
				req: { projectUUID: UUID; roleID: integer } & UpdateRole,
				signal?: AbortSignal,
			) => Responses<{
				200: Response<Role>;
				400: BadRequest;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
			}>;

			Delete: (
				req: { projectUUID: UUID; roleID: integer },
				signal?: AbortSignal,
			) => Responses<{
				204: EmptyResponse;
				401: Unauthorized;
				403: Forbidden;
				404: EmptyResponse;
				409: EmptyResponse;
			}>;

			Permissions: {
				GetAll: (
					req: { projectUUID: UUID; roleID: integer },
					signal?: AbortSignal,
				) => Responses<{
					200: Response<Permission[]>;
					401: Unauthorized;
					403: Forbidden;
					404: EmptyResponse;
				}>;
			};
		};
	};
};
