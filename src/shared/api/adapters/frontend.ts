import type { APIAdapter } from "../adapter";
import type {
	Color,
	Datetime,
	Error,
	Username,
	UUID,
} from "../openapi/components/schemas";
import type { integer } from "../openapi/components/schemas/integer";
import type { Member } from "../openapi/components/schemas";
import { tokenStorage } from "../token-storage";
import { HTTP } from "../status";

const err = (error: string) => (message?: string) => ({
	error,
	message: message ?? "",
});

const ERRORS = {
	Unauthorized: {
		error: "Ошибка авторизации",
		message: "Войдите в аккаунт",
	},
	NotFound: err("Not Found"),
	Conflict: err("Conflict"),
	BadRequest: err("Bad Request"),
	Forbidden: err("Forbidden"),
};

// ---------- Types matching DBML ----------
type DBBaseUser = {
	uuid: UUID;
	username: Username;
	user_type: "sso" | "manual";
	created_at: Datetime;
	updated_at: Datetime;
};

type DBManualUser = {
	user_uuid: UUID;
	password_hash: string;
};

type DBSSOUser = {
	user_uuid: UUID;
	external_id: integer;
};

type DBProject = {
	uuid: UUID;
	title: string;
	description: string | null;
	created_at: Datetime;
	updated_at: Datetime;
};

type DBPermission = {
	id: integer;
	name:
		| "view_project"
		| "manage_project"
		| "manage_members"
		| "manage_roles"
		| "manage_columns"
		| "manage_tasks"
		| "manage_statuses"
		| "manage_tags"
		| "manage_assignees";
	description: string | null;
};

type DBrole_permission = {
	role_id: integer;
	permission_id: integer;
};

type DBRole = {
	id: integer;
	project_uuid: UUID | null;
	name: string;
	description: string | null;
};

type DBMember = {
	project_uuid: UUID;
	user_uuid: UUID;
	role_id: integer;
	joined_at: Datetime;
};

type DBColumn = {
	id: integer;
	project_uuid: UUID;
	position: integer;
	name: string;
	color: Color | null;
	created_at: Datetime;
};

type DBStatus = {
	id: integer;
	project_uuid: UUID;
	name: string;
	created_at: Datetime;
};

type DBTask = {
	id: integer;
	column_id: integer;
	status_id: integer | null;
	creator_uuid: UUID;
	title: string | null;
	description: string | null;
	color: Color | null;
	created_at: Datetime;
	updated_at: Datetime;
	start_date: Datetime | null;
	end_date: Datetime | null;
	done: boolean;
	archived_at: Datetime | null;
	deleted_at: Datetime | null;
};

type DBAssignee = {
	task_id: integer;
	user_uuid: UUID;
	assigned_at: Datetime;
};

type DBTag = {
	id: integer;
	project_uuid: UUID;
	name: string;
	color: Color;
	created_at: Datetime;
};

type DBtask_tag = {
	task_id: integer;
	tag_id: integer;
	added_at: Datetime;
};

const PERMISSIONS: DBPermission[] = [
	{
		id: 1,
		name: "view_project",
		description: "Просматривать проект, его задачи и участников",
	},
	{
		id: 2,
		name: "manage_project",
		description:
			"Редактировать настройки проекта и управлять его конфигурацией",
	},
	{
		id: 3,
		name: "manage_members",
		description: "Добавлять и удалять участников проекта",
	},
	{
		id: 4,
		name: "manage_roles",
		description: "Создавать, изменять и назначать роли участникам",
	},
	{
		id: 5,
		name: "manage_columns",
		description: "Создавать и редактировать колонки доски",
	},
	{
		id: 6,
		name: "manage_tasks",
		description: "Создавать, редактировать и удалять задачи",
	},
	{
		id: 7,
		name: "manage_statuses",
		description: "Добавлять и изменять статусы задач",
	},
	{
		id: 8,
		name: "manage_tags",
		description: "Создавать и редактировать теги для задач",
	},
	{
		id: 9,
		name: "manage_assignees",
		description: "Назначать и снимать исполнителей с задач",
	},
];

type DB = {
	baseUser: DBBaseUser[];
	manualUser: DBManualUser[];
	ssoUser: DBSSOUser[];
	project: DBProject[];
	role: DBRole[];
	permission: DBPermission[];
	statuses: DBStatus[];
	member: DBMember[];
	column: DBColumn[];
	tasks: DBTask[];
	assignee: DBAssignee[];
	tag: DBTag[];
	role_permissions: DBrole_permission[];
	task_tag: DBtask_tag[];
};

type SessionTokens = Record<string, { userUUID: string }>;

// ---------- Helpers ----------
function generateUUID(): UUID {
	return crypto.randomUUID() as UUID;
}

function now(): Datetime {
	return new Date().toISOString() as Datetime;
}

function _p<T>(v: string): T {
	return JSON.parse(v) as T;
}

function _s(v: unknown): string {
	return JSON.stringify(v);
}

function prom<T>(
	cb: (
		resolve: (v: T | Promise<T>) => void,
		reject: (reason?: unknown) => void,
	) => void,
): Promise<T> {
	return new Promise<T>(cb);
}

function withSessions<T extends { st: SessionTokens }>(
	cb: (st: SessionTokens) => T,
): Omit<T, "st"> {
	const raw = localStorage.getItem("app_tokens");
	const st: SessionTokens = raw === null ? {} : _p<SessionTokens>(raw);
	const { st: newST, ...rest } = cb(st);
	localStorage.setItem("app_tokens", _s(newST));
	return rest;
}

function withDB<T extends { db: DB | null }>(cb: (db: DB) => T): Omit<T, "db"> {
	const raw = localStorage.getItem("app_db");
	const db: DB = raw === null ? getInitialDB() : _p<DB>(raw);
	const { db: newDB, ...rest } = cb(db);
	if (newDB !== null) localStorage.setItem("app_db", _s(newDB));
	return rest;
}

function getInitialDB(): DB {
	return {
		baseUser: [],
		manualUser: [],
		ssoUser: [],
		project: [],
		statuses: [],
		role: [
			{
				id: 1,
				project_uuid: null,
				name: "Создатель",
				description: "Создатель проекта, обладающий всеми разрешениями",
			},
		],
		permission: PERMISSIONS,
		role_permissions: [
			{ role_id: 1, permission_id: 1 },
			{ role_id: 1, permission_id: 2 },
			{ role_id: 1, permission_id: 3 },
			{ role_id: 1, permission_id: 4 },
			{ role_id: 1, permission_id: 5 },
			{ role_id: 1, permission_id: 6 },
			{ role_id: 1, permission_id: 7 },
			{ role_id: 1, permission_id: 8 },
			{ role_id: 1, permission_id: 9 },
		],
		member: [],
		column: [],
		tasks: [],
		assignee: [],
		tag: [],
		task_tag: [],
	};
}

// ---------- Auth / Session ----------
async function requireAuth(): Promise<
	{ ok: true; user: DBBaseUser } | { ok: false; error: Error }
> {
	const token = tokenStorage.get();
	if (token === null) {
		return {
			ok: false,
			error: {
				error: "Token not found",
				message: "Токен авторизации не найден",
			},
		};
	}
	const { user } = withDB((db) => {
		const { userUUID } = withSessions((st) => ({ st, ...st[token] }));
		return { db, user: db.baseUser.find((u) => u.uuid === userUUID) };
	});
	if (user === undefined) {
		return {
			ok: false,
			error: {
				error: "User not found",
				message: "Пользователь не найден",
			},
		};
	}
	return { ok: true, user };
}

async function requireProjectAccess(
	projectUUID: UUID,
	requiredPermission?: DBPermission["name"],
): Promise<
	| { ok: true; project: DBProject; role_id: integer }
	| {
			ok: false;
			status:
				| typeof HTTP.Unauthorized
				| typeof HTTP.Forbidden
				| typeof HTTP.NotFound;
			error: Error;
	  }
> {
	const auth = await requireAuth();
	if (!auth.ok)
		return { ok: false, status: HTTP.Unauthorized, error: ERRORS.Unauthorized };
	const { user } = auth;
	return prom((resolve) => {
		withDB((db) => {
			const project = db.project.find((p) => p.uuid === projectUUID);
			if (!project) {
				resolve({
					ok: false,
					status: HTTP.NotFound,
					error: {
						error: "Project not found",
						message: "Запрашиваемый проект не найден",
					},
				});
				return { db };
			}

			const membership = db.member.find(
				(m) => m.project_uuid === projectUUID && m.user_uuid === user.uuid,
			);
			if (!membership) {
				resolve({
					ok: false,
					status: HTTP.Forbidden,
					error: {
						error: "Project access",
						message: "Вы не являетесь участником данного проекта",
					},
				});
				return { db };
			}

			if (requiredPermission) {
				const rolePerms = db.role_permissions.filter(
					(rp) => rp.role_id === membership.role_id,
				);
				const permIds = rolePerms.map((rp) => rp.permission_id);
				const perms = db.permission.filter((p) => permIds.includes(p.id));
				if (!perms.some((p) => p.name === requiredPermission)) {
					resolve({
						ok: false,
						status: HTTP.Forbidden,
						error: {
							error: "Permission error",
							message: `Вы не обладаете нужным разрешением: ${requiredPermission}`,
						},
					});
					return { db };
				}
			}

			resolve({ ok: true, project, role_id: membership.role_id });
			return { db };
		});
	});
}

function nextId<T extends { id: integer }>(items: T[]): integer {
	return items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

const adjectives = [
	"swift",
	"bright",
	"silent",
	"bold",
	"calm",
	"fierce",
	"gentle",
	"wild",
];
const nouns = ["fox", "hawk", "wolf", "bear", "lynx", "crow", "deer", "otter"];

function randomUsername(): string {
	const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
	const noun = nouns[Math.floor(Math.random() * nouns.length)];
	const num = Math.floor(Math.random() * 1000);
	return `${adj}_${noun}_${num}`;
}

function ensureOwnership(
	projectUUID: UUID,
	taskID: integer,
):
	| {
			ok: false;
			status: typeof HTTP.NotFound;
			error: Error;
	  }
	| { ok: true; col: DBColumn; task: DBTask } {
	const { task } = withDB((db) => ({
		db,
		task: db.tasks.find((t) => t.id === taskID),
	}));
	if (task === undefined)
		return {
			ok: false,
			status: HTTP.NotFound,
			error: ERRORS.NotFound("Задача не найдена"),
		};
	const { col } = withDB((db) => ({
		db,
		col: db.column.find((c) => c.id === task.column_id),
	}));
	if (col === undefined)
		return {
			ok: false,
			status: HTTP.NotFound,
			error: ERRORS.NotFound("Колонка не найдена"),
		};
	if (col.project_uuid !== projectUUID)
		return {
			ok: false,
			status: HTTP.NotFound,
			error: ERRORS.NotFound("Задача не принадлежит этому проекту"),
		};
	return { ok: true, col, task };
}

// ---------- API Adapter ----------
export const Adapter: APIAdapter = {
	Auth: {
		Register: ({ username, password }) =>
			prom((resolve) =>
				withDB((db) => {
					const existing = db.baseUser.find((u) => u.username === username);
					if (existing) {
						resolve({
							status: HTTP.Conflict,
							body: {
								error: "Логин занят",
								message: "Пользователь с таким логином уже существует",
							},
						});
						return { db };
					}
					const userUUID = generateUUID();
					const user: DBBaseUser = {
						uuid: userUUID,
						username,
						user_type: "manual",
						created_at: now(),
						updated_at: now(),
					};
					db.baseUser.push(user);
					db.manualUser.push({
						user_uuid: userUUID,
						password_hash: password,
					});
					resolve({
						status: HTTP.Created,
						body: {
							username,
							uuid: userUUID,
						},
					});
					return { db };
				}),
			),

		Login: ({ username, password }) =>
			prom((resolve) =>
				withDB((db) => {
					const user = db.baseUser.find((u) => u.username === username);
					if (!user) {
						resolve({
							status: HTTP.Unauthorized,
							body: { error: "Credentials", message: "Неверные данные" },
						});
						return { db };
					}
					const manual = db.manualUser.find((m) => m.user_uuid === user.uuid);
					if (!manual || manual.password_hash !== password) {
						resolve({
							status: HTTP.Unauthorized,
							body: {
								error: "Credentials",
								message: "Неверные данные",
							},
						});
						return { db };
					}
					const token = generateUUID();
					withSessions((st) => {
						st[token] = { userUUID: user.uuid };
						return { st };
					});
					resolve({ status: HTTP.OK, body: { token } });
					return { db };
				}),
			),

		Logout: () =>
			requireAuth().then((res) => {
				if (res.ok) {
					return { status: HTTP.OK };
				}
				return { status: HTTP.Unauthorized, body: res.error };
			}),

		Exchange: async ({ token }) => {
			const url = new URL("https://vegastage.ru/authservice.php");
			url.searchParams.set("op", "parsetoken");
			url.searchParams.set("token", token);

			const res = await fetch(url.toString(), { credentials: "include" });
			if (!res.ok)
				return {
					status: HTTP.Unauthorized,
					body: {
						error: "InvalidToken",
						message: "SSO token is invalid or expired",
					},
				};

			const data = await res.json();
			if (typeof data["uai"] !== "number" || typeof data["sir"] !== "string")
				return {
					status: HTTP.Unauthorized,
					body: { error: "InvalidToken", message: "Could not parse SSO token" },
				};
			const external_id = data["uai"];

			const sessionToken = generateUUID();
			let username = randomUsername();

			withDB((db) => {
				const existing = db.ssoUser.find((u) => u.external_id === external_id);

				const usernameTaken = (un: string) =>
					db.baseUser.some((u) => u.username === un);

				while (usernameTaken(username)) {
					username = randomUsername();
				}

				if (existing !== undefined) {
					withSessions((st) => {
						st[sessionToken] = { userUUID: existing.user_uuid };
						return { st };
					});
					return { db };
				}

				const userUUID = generateUUID();
				const base: DBBaseUser = {
					uuid: userUUID,
					username,
					user_type: "sso",
					created_at: now(),
					updated_at: now(),
				};
				db.baseUser.push(base);
				db.ssoUser.push({ user_uuid: userUUID, external_id: external_id });

				withSessions((st) => {
					st[sessionToken] = { userUUID };
					return { st };
				});

				return { db };
			});

			return { status: HTTP.OK, body: { token: sessionToken } };
		},
	},

	Self: {
		Get: async () => {
			const res = await requireAuth();
			if (res.ok) return { status: HTTP.OK, body: res.user };
			return { status: HTTP.Unauthorized, body: res.error };
		},

		Update: async (req) => {
			const res = await requireAuth();
			if (!res.ok) return { status: HTTP.Unauthorized, body: res.error };
			return await prom((resolve) =>
				withDB((db) => {
					const base = db.baseUser.find((u) => u.uuid === res.user.uuid)!;
					if (req.username !== null) {
						if (db.baseUser.some((u) => u.username === req.username)) {
							resolve({
								status: HTTP.Conflict,
								body: {
									error: "Конфликт",
									message: "Пользователь с таким именем уже существует",
								},
							});
							return { db: null };
						}
						base.username = req.username;
					}
					if (base.user_type === "sso" && req.password !== null) {
						resolve({
							status: HTTP.BadRequest,
							body: {
								error: "Неправильный запрос",
								message: "Нельзя поменять пароль у привязанного пользователя",
							},
						});
						return { db: null };
					}
					if (req.password !== null && base.user_type === "sso") {
						const manual = db.manualUser.find(
							(u) => u.user_uuid === base.uuid,
						)!;
						manual.password_hash = req.password;
					}
					base.updated_at = now();
					resolve({ status: HTTP.OK, body: base });
					return { db };
				}),
			);
		},
	},

	User: {
		Get: async ({ userUUID }) => {
			const res = await requireAuth();
			if (!res.ok) return { status: HTTP.Unauthorized, body: res.error };
			const { user } = withDB((db) => ({
				db,
				user: db.baseUser.find((u) => u.uuid === userUUID),
			}));
			if (user === undefined) return { status: HTTP.NotFound };
			return {
				status: HTTP.OK,
				body: { username: user.username, uuid: user.uuid },
			};
		},
	},

	Project: {
		GetAll: () =>
			requireAuth().then((res) =>
				res.ok
					? prom((resolve) =>
							withDB((db) => {
								const memberProjects = db.member
									.filter((m) => m.user_uuid === res.user.uuid)
									.map((m) => m.project_uuid);
								const projects = db.project.filter((p) =>
									memberProjects.includes(p.uuid),
								);
								resolve({ status: HTTP.OK, body: structuredClone(projects) });
								return { db };
							}),
						)
					: { status: HTTP.Unauthorized, body: res.error },
			),

		Create: (req) =>
			requireAuth().then((res) =>
				res.ok
					? prom((resolve) =>
							withDB((db) => {
								const newProject: DBProject = {
									uuid: generateUUID(),
									title: req.title,
									description: req.description,
									created_at: now(),
									updated_at: now(),
								};
								db.project.push(newProject);
								db.member.push({
									project_uuid: newProject.uuid,
									user_uuid: res.user.uuid,
									role_id: 1,
									joined_at: now(),
								});
								resolve({
									status: HTTP.Created,
									body: structuredClone(newProject),
								});
								return { db };
							}),
						)
					: { status: HTTP.Unauthorized, body: res.error },
			),

		Get: ({ projectUUID }) =>
			requireProjectAccess(projectUUID, "view_project").then((res) =>
				res.ok
					? { status: HTTP.OK, body: structuredClone(res.project) }
					: { status: res.status, body: res.error },
			),

		Update: ({ projectUUID, ...update }) =>
			requireProjectAccess(projectUUID, "manage_project").then((res) => {
				if (!res.ok) return { status: res.status, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const project = db.project.find((p) => p.uuid === projectUUID)!;
						project.title = update.title;
						project.description = update.description;
						project.updated_at = now();
						resolve({ status: HTTP.OK, body: structuredClone(project) });
						return { db };
					}),
				);
			}),

		Delete: async ({ projectUUID }) => {
			const res = await requireAuth();
			if (!res.ok)
				return { status: HTTP.Unauthorized, body: ERRORS.Unauthorized };

			const { member } = withDB((db) => ({
				db,
				member: db.member.find(
					(m) =>
						m.user_uuid === res.user.uuid && m.project_uuid === projectUUID,
				),
			}));
			if (member === undefined)
				return {
					status: HTTP.Forbidden,
					body: ERRORS.Forbidden("Вы не являетесь участником проекта"),
				};

			// Удалить / выйти
			if (member.role_id === 1) {
				withDB((db) => {
					const colIds = db.column
						.filter((c) => c.project_uuid === projectUUID)
						.map((c) => c.id);
					db.tasks = db.tasks.filter(
						(t) => t.column_id === null || !colIds.includes(t.column_id),
					);
					db.column = db.column.filter((c) => c.project_uuid !== projectUUID);
					db.member = db.member.filter((m) => m.project_uuid !== projectUUID);
					db.tag = db.tag.filter((t) => t.project_uuid !== projectUUID);
					db.role = db.role.filter(
						(r) => !(r.project_uuid && r.project_uuid === projectUUID),
					);
					db.project = db.project.filter((p) => p.uuid !== projectUUID);
					return { db };
				});
				return { status: HTTP.NoContent };
			}
			return Adapter.Project.Members.Delete({
				projectUUID,
				userUUID: res.user.uuid,
			});
		},
		Columns: {
			GetAll: ({ projectUUID }) =>
				requireProjectAccess(projectUUID, "view_project").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					return prom((resolve) =>
						withDB((db) => {
							const columns = db.column
								.filter((c) => c.project_uuid === projectUUID)
								.sort((a, b) => a.position - b.position);
							resolve({ status: HTTP.OK, body: structuredClone(columns) });
							return { db };
						}),
					);
				}),

			Create: ({ projectUUID, ...create }) =>
				requireProjectAccess(projectUUID, "manage_project").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					return prom((resolve) =>
						withDB((db) => {
							const cols = db.column.filter(
								(c) => c.project_uuid === projectUUID,
							);
							const newCol: DBColumn = {
								id: nextId(db.column),
								project_uuid: projectUUID,
								position: cols.length,
								color: null,
								name: create.name,
								created_at: now(),
							};
							db.column.push(newCol);
							resolve({
								status: HTTP.Created,
								body: structuredClone(newCol),
							});
							return { db };
						}),
					);
				}),

			Get: ({ columnID }) =>
				prom((resolve) => {
					const { col } = withDB((db) => ({
						db,
						col: db.column.find((c) => c.id === columnID),
					}));
					if (col === undefined) {
						resolve({ status: HTTP.NotFound });
						return;
					}
					requireProjectAccess(col.project_uuid, "view_project").then((res) => {
						if (res.ok) resolve({ status: HTTP.OK, body: col });
						else resolve({ status: res.status, body: res.error });
					});
				}),

			Update: ({ columnID, ...update }) =>
				prom((resolve) => {
					const { col } = withDB((db) => ({
						db,
						col: db.column.find((c) => c.id === columnID),
					}));
					if (col === undefined) {
						resolve({ status: HTTP.NotFound });
						return;
					}
					requireProjectAccess(col.project_uuid, "manage_columns").then(
						(res) => {
							if (!res.ok) {
								resolve({ status: res.status, body: res.error });
								return;
							}
							withDB((db) => {
								const c = db.column.find((c) => c.id === columnID)!;
								c.name = update.name;
								c.color = update.color;
								resolve({ status: HTTP.OK, body: structuredClone(c) });
								return { db };
							});
						},
					);
				}),

			Move: ({ columnID, direction }) =>
				prom(async (resolve) => {
					const { col } = withDB((db) => ({
						db,
						col: db.column.find((col) => col.id == columnID),
					}));
					if (col === undefined) {
						resolve({ status: HTTP.NotFound });
						return;
					}
					const res = await requireProjectAccess(
						col.project_uuid,
						"manage_columns",
					);
					if (!res.ok) {
						resolve({ status: res.status, body: res.error });
						return;
					}
					const near = col.position + (direction === "right" ? 1 : -1);
					const { other } = withDB((db) => {
						return {
							db,
							other: db.column.find(
								(c) =>
									c.project_uuid === col.project_uuid && c.position === near,
							),
						};
					});
					if (other === undefined) {
						resolve({ status: HTTP.NotFound });
						return;
					}
					const { newCol } = withDB((db) => {
						const cur = db.column.find((c) => c.id === col.id)!;
						cur.position = other.position;
						const next = db.column.find((c) => c.id === other.id)!;
						next.position = col.position;
						return { db, newCol: cur };
					});
					resolve({ status: HTTP.OK, body: newCol });
				}),

			Delete: ({ columnID }) =>
				prom(async (resolve) => {
					const { col } = withDB((db) => ({
						db,
						col: db.column.find((c) => c.id === columnID),
					}));
					if (col === undefined) {
						resolve({ status: HTTP.NotFound });
						return;
					}
					const res = await requireProjectAccess(
						col.project_uuid,
						"manage_columns",
					);
					if (!res.ok) {
						resolve({ status: res.status, body: res.error });
						return;
					}
					withDB((db) => {
						const idx = db.column.findIndex((c) => c.id === columnID);
						if (idx === -1) {
							resolve({ status: HTTP.NotFound });
							return { db };
						}
						db.column.splice(idx, 1);
						db.column.forEach((c) => {
							if (c.project_uuid !== col.project_uuid) return;
							if (c.position <= col.position) return;
							c.position -= 1;
						});
						const time = now();
						db.tasks.forEach((task) => {
							if (task.column_id !== columnID) return;
							task.deleted_at = time;
						});
						resolve({ status: HTTP.NoContent });
						return { db };
					});
				}),
		},

		// ---------- Members ----------
		Members: {
			GetAll: ({ projectUUID }) =>
				requireProjectAccess(projectUUID, "view_project").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					return prom((resolve) =>
						withDB((db) => {
							const memberships = db.member.filter(
								(m) => m.project_uuid === projectUUID,
							);
							const apiMembers: Member[] = memberships.map((m) => {
								const user = db.baseUser.find((u) => u.uuid === m.user_uuid)!;
								const role = db.role.find((r) => r.id === m.role_id)!;
								return { ...user, ...m, role_id: role.id };
							});
							resolve({ status: HTTP.OK, body: apiMembers });
							return { db };
						}),
					);
				}),

			Create: ({ projectUUID, ...create }) =>
				requireProjectAccess(projectUUID, "manage_members").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					return prom((resolve) =>
						withDB((db) => {
							const userExists = db.baseUser.some(
								(u) => u.uuid === create.user_uuid,
							);
							if (!userExists) {
								resolve({
									status: HTTP.BadRequest,
									body: {
										error: "UserDoesNotExist",
										message:
											"Can't add user as a member because user with such id does not exist",
									},
								});
								return { db };
							}
							const existing = db.member.find(
								(m) =>
									m.project_uuid === projectUUID &&
									m.user_uuid === create.user_uuid,
							);
							if (existing) {
								resolve({ status: HTTP.Conflict });
								return { db };
							}
							const roleExists = db.role.some(
								(r) =>
									r.id === create.role_id &&
									(r.project_uuid === projectUUID || !r.project_uuid),
							);
							if (!roleExists) {
								resolve({
									status: HTTP.BadRequest,
									body: {
										error: "RoleDoesNotExist",
										message: "Role with such id does not exist",
									},
								});
								return { db };
							}
							const newMembership: DBMember = {
								project_uuid: projectUUID,
								user_uuid: create.user_uuid,
								role_id: create.role_id,
								joined_at: now(),
							};
							db.member.push(newMembership);
							const user = db.baseUser.find(
								(u) => u.uuid === create.user_uuid,
							)!;
							const role = db.role.find((r) => r.id === create.role_id)!;
							resolve({
								status: HTTP.Created,
								body: { ...user, ...newMembership, role_id: role.id },
							});
							return { db };
						}),
					);
				}),

			Get: ({ projectUUID, userUUID }) =>
				requireProjectAccess(projectUUID, "view_project").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					return prom((resolve) =>
						withDB((db) => {
							const m = db.member.find(
								(m) =>
									m.project_uuid === projectUUID && m.user_uuid === userUUID,
							);
							if (!m) {
								resolve({ status: HTTP.NotFound });
								return { db };
							}
							const user = db.baseUser.find((u) => u.uuid === userUUID)!;
							const role = db.role.find((r) => r.id === m.role_id)!;
							const apiMember: Member = {
								...user,
								project_uuid: m.project_uuid,
								role_id: role.id,
								joined_at: m.joined_at,
							};
							resolve({ status: HTTP.OK, body: apiMember });
							return { db };
						}),
					);
				}),

			Update: ({ projectUUID, userUUID, ...update }) =>
				requireProjectAccess(projectUUID, "manage_members").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					return prom((resolve) =>
						withDB((db) => {
							const m = db.member.find(
								(m) =>
									m.project_uuid === projectUUID && m.user_uuid === userUUID,
							);
							if (!m) {
								resolve({ status: HTTP.NotFound });
								return { db };
							}
							if (update.role_id !== null) {
								const roleExists = db.role.some(
									(r) =>
										r.id === update.role_id &&
										(r.project_uuid === projectUUID || !r.project_uuid),
								);
								if (!roleExists) {
									resolve({
										status: HTTP.BadRequest,
										body: {
											error: "Bad request",
											message: "Роль существует",
										},
									});
									return { db };
								}
								m.role_id = update.role_id;
							}
							const user = db.baseUser.find((u) => u.uuid === userUUID)!;
							const role = db.role.find((r) => r.id === m.role_id)!;
							const apiMember: Member = {
								...user,
								project_uuid: m.project_uuid,
								role_id: role.id,
								joined_at: m.joined_at,
							};
							resolve({ status: HTTP.OK, body: apiMember });
							return { db };
						}),
					);
				}),

			Delete: async ({ projectUUID, userUUID }) => {
				const res = await requireProjectAccess(projectUUID, "manage_members");
				if (!res.ok) return { status: res.status, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const idx = db.member.findIndex(
							(m) => m.project_uuid === projectUUID && m.user_uuid === userUUID,
						);
						if (idx === -1) {
							resolve({ status: HTTP.NotFound });
							return { db };
						}
						db.member.splice(idx, 1);
						db.assignee = db.assignee.filter((a) => a.user_uuid !== userUUID);
						resolve({ status: HTTP.NoContent });
						return { db };
					}),
				);
			},
		},

		Statuses: {
			GetAll: ({ projectUUID }) =>
				requireProjectAccess(projectUUID, "view_project").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					return prom((resolve) =>
						withDB((db) => {
							resolve({
								status: HTTP.OK,
								body: db.statuses.filter((s) => s.project_uuid === projectUUID),
							});
							return { db };
						}),
					);
				}),
			Create: ({ projectUUID, name }) =>
				requireProjectAccess(projectUUID, "manage_statuses").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					return prom((resolve) =>
						withDB((db) => {
							const newStatus: DBStatus = {
								id: nextId(db.statuses),
								name,
								project_uuid: projectUUID,
								created_at: now(),
							};
							db.statuses.push(newStatus);
							resolve({ status: HTTP.Created, body: newStatus });
							return { db };
						}),
					);
				}),
			Get: ({ projectUUID, statusID }) =>
				requireProjectAccess(projectUUID, "manage_statuses").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					const { status } = withDB((db) => ({
						db,
						status: db.statuses.find(
							(s) => s.id === statusID && s.project_uuid === projectUUID,
						),
					}));
					if (status === undefined)
						return {
							status: HTTP.NotFound,
							body: ERRORS.NotFound("Статус не найден"),
						};
					return { status: HTTP.OK, body: status };
				}),
			Update: ({ projectUUID, statusID, ...update }) =>
				requireProjectAccess(projectUUID, "manage_statuses").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					const { newStatus } = withDB((db) => {
						const status = db.statuses.find(
							(s) => s.id === statusID && s.project_uuid === projectUUID,
						);
						if (status === undefined) return { db, newStatus: status };
						status.name = update.name;
						return { db, newStatus: status };
					});
					if (newStatus === undefined)
						return {
							status: HTTP.NotFound,
							body: ERRORS.NotFound("Статус не найден"),
						};
					return { status: HTTP.OK, body: newStatus };
				}),
			Delete: ({ projectUUID, statusID }) =>
				requireProjectAccess(projectUUID, "manage_statuses").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					return prom((resolve) =>
						withDB((db) => {
							const idx = db.statuses.findIndex(
								(s) => s.project_uuid === projectUUID && s.id === statusID,
							);
							if (idx === -1) {
								resolve({
									status: HTTP.NotFound,
								});
								return { db };
							}
							if (db.tasks.some((t) => t.status_id === statusID)) {
								resolve({ status: HTTP.Conflict });
								return { db };
							}
							db.statuses.splice(idx, 1);
							resolve({ status: HTTP.NoContent });
							return { db };
						}),
					);
				}),
		},

		// ---------- Tasks ----------
		Tasks: {
			GetAll: ({ projectUUID }) =>
				requireProjectAccess(projectUUID, "view_project").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					return prom((resolve) =>
						withDB((db) => {
							resolve({
								status: HTTP.OK,
								body: db.tasks.filter((task) => task.deleted_at === null),
							});
							return { db };
						}),
					);
				}),

			Create: ({ projectUUID, ...rest }) =>
				requireAuth().then((auth) =>
					auth.ok
						? requireProjectAccess(projectUUID, "manage_tasks").then((res) => {
								if (!res.ok) return { status: res.status, body: res.error };
								return prom((resolve) =>
									withDB((db) => {
										const newTask: DBTask = {
											id: nextId(db.tasks),
											creator_uuid: auth.user.uuid,
											created_at: now(),
											updated_at: now(),
											status_id: null,
											deleted_at: null,
											archived_at: null,
											color: null,
											done: false,
											...rest,
										};
										db.tasks.push(newTask);
										resolve({ status: HTTP.Created, body: newTask });
										return { db };
									}),
								);
							})
						: { status: HTTP.Unauthorized, body: auth.error },
				),

			Get: ({ projectUUID, taskID }) =>
				requireProjectAccess(projectUUID, "view_project").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					const own = ensureOwnership(projectUUID, taskID);
					if (!own.ok) return { status: own.status, body: own.error };
					return {
						status: HTTP.OK,
						body: own.task,
					};
				}),

			Update: ({ projectUUID, taskID, ...update }) =>
				requireProjectAccess(projectUUID, "manage_tasks").then(async (res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					const own = ensureOwnership(projectUUID, taskID);
					if (!own.ok) return { status: own.status, body: own.error };

					return prom((resolve) =>
						withDB((db) => {
							const task = db.tasks.find((t) => t.id === taskID);
							if (task === undefined || task.deleted_at !== null) {
								resolve({ status: HTTP.NotFound });
								return { db };
							}
							task.title = update.title;
							task.status_id = update.status_id;
							task.description = update.description;
							task.start_date = update.start_date;
							task.end_date = update.end_date;
							task.color = update.color;
							task.done = update.done;

							const newCol = db.column.find(
								(c) =>
									c.id === update.column_id && c.project_uuid === projectUUID,
							);
							if (newCol === undefined) {
								resolve({
									status: HTTP.BadRequest,
									body: ERRORS.BadRequest("Колонка не найдена"),
								});
								return { db };
							}
							task.column_id = update.column_id;

							task.archived_at = update.archived
								? task.archived_at === null
									? now()
									: task.archived_at
								: null;
							task.updated_at = now();
							resolve({ status: HTTP.OK, body: task });
							return { db };
						}),
					);
				}),

			Move: ({ projectUUID, taskID, column_id }) =>
				requireProjectAccess(projectUUID, "manage_tasks").then(async (res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					const own = ensureOwnership(projectUUID, taskID);
					if (!own.ok) return { status: own.status, body: own.error };
					const { col: colToMove } = withDB((db) => ({
						db,
						col: db.column.find((c) => c.id === column_id),
					}));
					if (colToMove === undefined)
						return {
							status: HTTP.BadRequest,
							body: ERRORS.BadRequest("Колонка не найдена"),
						};

					const { task: newTask } = withDB((db) => {
						const task = db.tasks.find((t) => t.id === own.task.id)!;
						task.column_id = column_id;
						return { db, task: task };
					});

					return { status: HTTP.OK, body: newTask };
				}),

			Delete: ({ projectUUID, taskID }) =>
				requireProjectAccess(projectUUID, "manage_tasks").then((res) => {
					if (!res.ok) return { status: res.status, body: res.error };
					return prom((resolve) =>
						withDB((db) => {
							const task = db.tasks.find((t) => t.id === taskID);
							if (task === undefined || task.deleted_at !== null) {
								resolve({ status: HTTP.NotFound });
								return { db };
							}
							task.deleted_at = now();
							resolve({ status: HTTP.NoContent });
							return { db };
						}),
					);
				}),

			Tags: {
				GetAll: async ({ projectUUID, taskID }) => {
					const { task } = withDB((db) => ({
						db,
						task: db.tasks.find((t) => t.id === taskID),
					}));
					if (task === undefined || task.deleted_at !== null)
						return { status: HTTP.NotFound };
					const res = await requireProjectAccess(projectUUID, "view_project");
					if (!res.ok) return { status: res.status, body: res.error };

					const { tags } = withDB((db) => {
						const tagIds = db.task_tag
							.filter((tt) => tt.task_id === taskID)
							.map((tt) => tt.tag_id);
						return { db, tags: db.tag.filter((t) => tagIds.includes(t.id)) };
					});
					return { status: HTTP.OK, body: tags };
				},

				Create: async ({ projectUUID, taskID, tagID }) => {
					const { task } = withDB((db) => ({
						db,
						task: db.tasks.find((t) => t.id === taskID),
					}));
					if (task === undefined || task.deleted_at !== null)
						return { status: HTTP.NotFound };
					const res = await requireProjectAccess(projectUUID, "manage_tasks");
					if (!res.ok) return { status: res.status, body: res.error };
					return await prom((resolve) =>
						withDB((db) => {
							const task = db.tasks.find((t) => t.id === taskID);
							if (task === undefined || task.deleted_at !== null) {
								resolve({ status: HTTP.NotFound });
								return { db };
							}
							const tag = db.tag.find(
								(t) => t.id === tagID && t.project_uuid === projectUUID,
							);
							if (tag === undefined) {
								resolve({ status: HTTP.NotFound });
								return { db };
							}
							const existing = db.task_tag.find(
								(tt) => tt.task_id === taskID && tt.tag_id === tagID,
							);
							if (existing) {
								resolve({ status: HTTP.Conflict });
								return { db };
							}
							db.task_tag.push({
								task_id: taskID,
								tag_id: tagID,
								added_at: now(),
							});
							resolve({ status: HTTP.NoContent });
							return { db };
						}),
					);
				},

				Delete: async ({ projectUUID, taskID, tagID }) => {
					const { task } = withDB((db) => ({
						db,
						task: db.tasks.find((t) => t.id === taskID),
					}));
					if (task === undefined || task.deleted_at !== null)
						return { status: HTTP.NotFound };
					const res = await requireProjectAccess(projectUUID, "manage_tasks");
					if (!res.ok) return { status: res.status, body: res.error };
					return await prom((resolve) =>
						withDB((db) => {
							const task = db.tasks.find((t) => t.id === taskID);
							if (task === undefined || task.deleted_at !== null) {
								resolve({ status: HTTP.NotFound });
								return { db };
							}
							const idx = db.task_tag.findIndex(
								(tt) => tt.task_id === taskID && tt.tag_id === tagID,
							);
							if (idx === -1) {
								resolve({ status: HTTP.NotFound });
								return { db };
							}
							db.task_tag.splice(idx, 1);
							resolve({ status: HTTP.NoContent });
							return { db };
						}),
					);
				},
			},
		},

		// ---------- Assignees ----------
		Assignees: {
			GetAll: async ({ projectUUID, taskID }) => {
				const res = await requireProjectAccess(projectUUID, "view_project");
				if (!res.ok) return { status: res.status, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const task = db.tasks.find((t) => t.id === taskID);
						if (task === undefined || task.deleted_at !== null) {
							resolve({ status: HTTP.NotFound });
							return { db };
						}
						resolve({
							status: HTTP.OK,
							body: db.assignee.filter((a) => a.task_id === taskID),
						});
						return { db };
					}),
				);
			},

			Create: async ({ projectUUID, taskID, user_uuid }) => {
				const res = await requireProjectAccess(projectUUID, "manage_assignees");
				if (!res.ok) return { status: res.status, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const task = db.tasks.find((t) => t.id === taskID);
						if (task === undefined || task.deleted_at !== null) {
							resolve({ status: HTTP.NotFound });
							return { db };
						}
						const isMember = db.member.some(
							(m) =>
								m.project_uuid === projectUUID && m.user_uuid === user_uuid,
						);
						if (!isMember) {
							resolve({
								status: HTTP.BadRequest,
								body: ERRORS.BadRequest(
									"Пользователь не является учатсником проекта",
								),
							});
							return { db };
						}
						const existing = db.assignee.find(
							(a) => a.task_id === taskID && a.user_uuid === user_uuid,
						);
						if (existing) {
							resolve({ status: HTTP.Conflict });
							return { db };
						}
						const newAssignment: DBAssignee = {
							task_id: taskID,
							user_uuid: user_uuid,
							assigned_at: now(),
						};
						db.assignee.push(newAssignment);
						resolve({ status: HTTP.Created, body: newAssignment });
						return { db };
					}),
				);
			},

			Delete: async ({ projectUUID, taskID, userUUID }) => {
				const res = await requireProjectAccess(projectUUID, "manage_assignees");
				if (!res.ok) return { status: res.status, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const task = db.tasks.find((t) => t.id === taskID);
						if (task === undefined || task.deleted_at !== null) {
							resolve({ status: HTTP.NotFound });
							return { db };
						}
						const idx = db.assignee.findIndex(
							(a) => a.task_id === taskID && a.user_uuid === userUUID,
						);
						if (idx === -1) {
							resolve({ status: HTTP.NotFound });
							return { db };
						}
						db.assignee.splice(idx, 1);
						resolve({ status: HTTP.NoContent });
						return { db };
					}),
				);
			},
		},

		// ---------- Tags (Project-level) ----------
		Tags: {
			GetAll: async ({ projectUUID }) => {
				const res = await requireProjectAccess(projectUUID, "view_project");
				if (!res.ok) return { status: res.status, body: res.error };
				const { tags } = withDB((db) => {
					const tags = db.tag.filter((t) => t.project_uuid === projectUUID);
					return { db, tags };
				});
				return { status: HTTP.OK, body: tags };
			},

			Create: async ({ projectUUID, ...create }) => {
				const res = await requireProjectAccess(projectUUID, "manage_tags");
				if (!res.ok) return { status: res.status, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const newTag: DBTag = {
							id: nextId(db.tag),
							project_uuid: projectUUID,
							name: create.name,
							color: create.color,
							created_at: now(),
						};
						db.tag.push(newTag);
						resolve({ status: HTTP.Created, body: newTag });
						return { db };
					}),
				);
			},

			Update: async ({ projectUUID, tagID, ...update }) => {
				const res = await requireProjectAccess(projectUUID, "manage_tags");
				if (!res.ok) return { status: res.status, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const tag = db.tag.find(
							(t) => t.id === tagID && t.project_uuid === projectUUID,
						);
						if (tag === undefined) {
							resolve({ status: HTTP.NotFound });
							return { db };
						}
						tag.name = update.name;
						tag.color = update.color;
						resolve({ status: HTTP.OK, body: tag });
						return { db };
					}),
				);
			},

			Delete: async ({ projectUUID, tagID }) => {
				const res = await requireProjectAccess(projectUUID, "manage_tags");
				if (!res.ok) return { status: res.status, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const idx = db.tag.findIndex(
							(t) => t.id === tagID && t.project_uuid === projectUUID,
						);
						if (idx === -1) {
							resolve({ status: HTTP.NotFound });
							return { db };
						}
						db.tag.splice(idx, 1);
						db.task_tag = db.task_tag.filter((tt) => tt.tag_id !== tagID);
						resolve({ status: HTTP.NoContent });
						return { db };
					}),
				);
			},
		},

		// ---------- Roles ----------
		Roles: {
			GetAll: async ({ projectUUID }) => {
				const res = await requireProjectAccess(projectUUID, "view_project");
				if (!res.ok) return { status: HTTP.Forbidden, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const roles = db.role.filter(
							(r) => r.project_uuid === projectUUID || r.project_uuid === null,
						);
						resolve({ status: HTTP.OK, body: roles });
						return { db };
					}),
				);
			},

			Create: async ({ projectUUID, ...create }) => {
				const res = await requireProjectAccess(projectUUID, "manage_roles");
				if (!res.ok) return { status: HTTP.Forbidden, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const newRole: DBRole = {
							id: nextId(db.role),
							project_uuid: projectUUID,
							name: create.name,
							description: create.description,
						};
						db.role.push(newRole);
						resolve({ status: HTTP.Created, body: newRole });
						return { db };
					}),
				);
			},

			Get: async ({ projectUUID, roleID }) => {
				const res = await requireProjectAccess(projectUUID, "view_project");
				if (!res.ok) return { status: res.status, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const role = db.role.find(
							(r) =>
								r.id === roleID &&
								(r.project_uuid === projectUUID || r.project_uuid === null),
						);
						if (role === undefined) {
							resolve({ status: HTTP.NotFound });
							return { db };
						}
						resolve({ status: HTTP.OK, body: role });
						return { db };
					}),
				);
			},

			Update: async ({ projectUUID, roleID, ...update }) => {
				const res = await requireProjectAccess(projectUUID, "manage_roles");
				if (!res.ok) return { status: res.status, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const role = db.role.find(
							(r) =>
								r.id === roleID &&
								(r.project_uuid === projectUUID || !r.project_uuid),
						);
						if (role === undefined) {
							resolve({ status: HTTP.NotFound });
							return { db };
						}
						role.name = update.name;
						role.description = update.description;
						const curPermIds = db.role_permissions
							.filter((rp) => rp.role_id === roleID)
							.map((rp) => rp.permission_id);
						const curPermIdsSet = new Set(curPermIds);
						const newPermIdsSet = new Set(update.permission_ids);
						const toAdd = update.permission_ids.filter(
							(id) => !curPermIdsSet.has(id),
						);
						const toRemove = new Set(
							curPermIds.filter((id) => !newPermIdsSet.has(id)),
						);
						db.role_permissions = db.role_permissions.filter(
							(rp) =>
								!(rp.role_id === roleID && toRemove.has(rp.permission_id)),
						);
						toAdd.forEach((id) =>
							db.role_permissions.push({
								role_id: roleID,
								permission_id: id,
							}),
						);
						resolve({ status: HTTP.OK, body: role });
						return { db };
					}),
				);
			},

			Delete: async ({ projectUUID, roleID }) => {
				const res = await requireProjectAccess(projectUUID, "manage_roles");
				if (!res.ok) return { status: res.status, body: res.error };
				return prom((resolve) =>
					withDB((db) => {
						const idx = db.role.findIndex(
							(r) =>
								r.id === roleID &&
								(r.project_uuid === projectUUID || r.project_uuid === null),
						);
						if (idx === -1) {
							resolve({ status: HTTP.NotFound });
							return { db };
						}
						const used = db.member.some(
							(m) => m.project_uuid === projectUUID && m.role_id === roleID,
						);
						if (used) {
							resolve({ status: HTTP.Conflict });
							return { db };
						}
						db.role.splice(idx, 1);
						db.role_permissions = db.role_permissions.filter(
							(rp) => rp.role_id !== roleID,
						);
						resolve({ status: HTTP.NoContent });
						return { db };
					}),
				);
			},

			Permissions: {
				GetAll: async ({ projectUUID, roleID }) => {
					const res = await requireProjectAccess(projectUUID, "view_project");
					if (!res.ok) return { status: res.status, body: res.error };
					return prom((resolve) =>
						withDB((db) => {
							const role = db.role.find(
								(r) =>
									r.id === roleID &&
									(r.project_uuid === projectUUID || !r.project_uuid),
							);
							if (!role) {
								resolve({ status: HTTP.NotFound });
								return { db };
							}
							const permIds = db.role_permissions
								.filter((rp) => rp.role_id === roleID)
								.map((rp) => rp.permission_id);
							const permissions = db.permission.filter((p) =>
								permIds.includes(p.id),
							);
							resolve({ status: HTTP.OK, body: permissions });
							return { db };
						}),
					);
				},
			},
		},
	},
	Permissions: {
		GetAll: async () => {
			const res = await requireAuth();
			if (!res.ok)
				return {
					status: 401,
					body: ERRORS.Unauthorized,
				};
			const { permissions } = withDB((db) => ({
				db,
				permissions: db.permission,
			}));
			return {
				status: 200,
				body: permissions,
			};
		},
	},
};
