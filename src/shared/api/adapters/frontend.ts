import type { APIAdapter } from "../adapter";
import type {
	Color,
	Datetime,
	Username,
	UUID,
} from "../openapi/components/schemas";
import type { integer } from "../openapi/components/schemas/integer";
import type { Member } from "../openapi/components/schemas";

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

type DBProject = {
	uuid: UUID;
	title: string;
	description?: string;
	created_at: Datetime;
	updated_at: Datetime;
};

type DBPermission = {
	id: integer;
	name: string;
	description?: string;
};

type DBrole_permission = {
	role_id: integer;
	permission_id: integer;
};

type DBRole = {
	id: integer;
	project_uuid?: UUID;
	name: string;
	description?: string;
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
	created_at: Datetime;
};

// type DBStatus = {
// 	id: integer;
// 	project_uuid: UUID;
// 	name: string;
// 	created_at: Datetime;
// };

type DBTask = {
	id: integer;
	column_id: integer;
	status_id?: integer;
	creator_uuid: UUID;
	title?: string;
	description?: string;
	deleted_at?: Datetime;
	archived_at?: Datetime;
	created_at: Datetime;
	updated_at: Datetime;
	start_date?: Datetime;
	end_date?: Datetime;
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

type DB = {
	baseUser: DBBaseUser[];
	manualUser: DBManualUser[];
	project: DBProject[];
	role: DBRole[];
	permission: DBPermission[];
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

function withDB<T extends { db: DB }>(cb: (db: DB) => T): Omit<T, "db"> {
	const raw = localStorage.getItem("app_db");
	const db: DB = raw === null ? getInitialDB() : _p<DB>(raw);
	const { db: newDB, ...rest } = cb(db);
	localStorage.setItem("app_db", _s(newDB));
	return rest;
}

const PERMISSIONS = {
	MANAGE_PROJECT: "manage_project",
	MANAGE_MEMBERS: "manage_members",
	MANAGE_ROLES: "manage_roles",
	EDIT_TASKS: "edit_tasks",
	DELETE_TASKS: "delete_tasks",
};

function getInitialDB(): DB {
	return {
		baseUser: [],
		manualUser: [],
		project: [],
		role: [
			{
				id: 1,
				name: "Creator",
				description: "Full project owner",
			},
		],
		permission: [
			{
				id: 1,
				name: PERMISSIONS.MANAGE_PROJECT,
				description: "Edit/delete project",
			},
			{
				id: 2,
				name: PERMISSIONS.MANAGE_MEMBERS,
				description: "Add/remove members",
			},
			{
				id: 3,
				name: PERMISSIONS.MANAGE_ROLES,
				description: "Create/edit roles",
			},
			{
				id: 4,
				name: PERMISSIONS.EDIT_TASKS,
				description: "Create/update tasks",
			},
			{ id: 5, name: PERMISSIONS.DELETE_TASKS, description: "Delete tasks" },
		],
		role_permissions: [
			{ role_id: 1, permission_id: 1 },
			{ role_id: 1, permission_id: 2 },
			{ role_id: 1, permission_id: 3 },
			{ role_id: 1, permission_id: 4 },
			{ role_id: 1, permission_id: 5 },
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
	{ ok: true; user: DBBaseUser } | { ok: false }
> {
	console.group('requireAuth():');
	console.log("getting token...");
	const token = sessionStorage.getItem("token");
	console.log("got token");
	if (token === null) {
		console.groupEnd();
		return { ok: false };
	}
	console.log("getting session");
	const { user } = withDB((db) => {
		const { userUUID } = withSessions((st) => ({ st, ...st[token] }));
		return { db, user: db.baseUser.find((u) => u.uuid === userUUID) };
	});
	if (user === undefined) {
		console.groupEnd();
		return { ok: false };
	}
	console.groupEnd();
	return { ok: true, user };
}

async function requireProjectAccess(
	projectUUID: UUID,
	requiredPermission?: string,
): Promise<
	| { ok: true; project: DBProject; role_id: integer }
	| { ok: false; status: 401 | 403 | 404 }
> {
	const auth = await requireAuth();
	if (!auth.ok) return { ok: false, status: 401 };
	const { user } = auth;
	return prom((resolve) => {
		withDB((db) => {
			const project = db.project.find((p) => p.uuid === projectUUID);
			if (!project) {
				resolve({ ok: false, status: 404 });
				return { db };
			}

			const membership = db.member.find(
				(m) => m.project_uuid === projectUUID && m.user_uuid === user.uuid,
			);
			if (!membership) {
				resolve({ ok: false, status: 403 });
				return { db };
			}

			if (requiredPermission) {
				const rolePerms = db.role_permissions.filter(
					(rp) => rp.role_id === membership.role_id,
				);
				const permIds = rolePerms.map((rp) => rp.permission_id);
				const perms = db.permission.filter((p) => permIds.includes(p.id));
				if (!perms.some((p) => p.name === requiredPermission)) {
					resolve({ ok: false, status: 403 });
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

const err = {
	body: {
		error: "",
		message: "",
	},
};

// ---------- API Adapter ----------
export const Adapter: APIAdapter = {
	Auth: {
		Register: ({ username, password }) =>
			prom((resolve) =>
				withDB((db) => {
					const existing = db.baseUser.find((u) => u.username === username);
					if (existing) {
						resolve({ status: 409, ...err });
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
						status: 201,
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
							status: 401,
							body: { error: "Credentials", message: "Неверные данные" },
						});
						return { db };
					}
					const manual = db.manualUser.find((m) => m.user_uuid === user.uuid);
					if (!manual || manual.password_hash !== password) {
						resolve({
							status: 401,
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
					sessionStorage.setItem("token", token);
					resolve({ status: 200, body: { token } });
					return { db };
				}),
			),

		Logout: () =>
			requireAuth().then((res) => {
				if (res.ok) {
					sessionStorage.removeItem("token");
					return { status: 200 };
				}
				return { status: 401, ...err };
			}),
	},

	Self: {
		Get: async () => {
			const res = await requireAuth();
			if (res.ok) return { status: 200, body: res.user };
			return { status: 401, ...err };
		},

		Update: async (req) => {
			const res = await requireAuth();
			if (res.ok) {
				return await prom((resolve) =>
					withDB((db) => {
						const base = db.baseUser.find((u) => u.uuid === res.user.uuid)!;
						const manual = db.manualUser.find(
							(u) => u.user_uuid === res.user.uuid,
						)!;
						if (manual.password_hash !== req.old_password) {
							resolve({ status: 403, ...err });
							return { db };
						}
						base.username = req.username;
						manual.password_hash = req.password;
						base.updated_at = now();
						resolve({ status: 200, body: structuredClone(base) });
						return { db };
					}),
				);
			} else return { status: 401, ...err };
		},
	},

	User: {
		Get: async ({ userUUID }) => {
			const res = await requireAuth();
			if (!res.ok) return { status: 401, ...err };
			const { user } = withDB((db) => ({
				db,
				user: db.baseUser.find((u) => u.uuid === userUUID),
			}));
			if (user === undefined) return { status: 404 };
			return {
				status: 200,
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
								resolve({ status: 200, body: structuredClone(projects) });
								return { db };
							}),
						)
					: { status: 401, ...err },
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
								resolve({ status: 201, body: structuredClone(newProject) });
								return { db };
							}),
						)
					: { status: 401, ...err },
			),

		Get: ({ projectUUID }) =>
			requireProjectAccess(projectUUID).then((res) =>
				res.ok
					? { status: 200, body: structuredClone(res.project) }
					: { status: res.status, ...err },
			),

		Update: ({ projectUUID, ...update }) =>
			requireProjectAccess(projectUUID, PERMISSIONS.MANAGE_PROJECT).then(
				(res) => {
					if (!res.ok) return { status: res.status, ...err };
					return prom((resolve) =>
						withDB((db) => {
							const project = db.project.find((p) => p.uuid === projectUUID)!;
							project.title = update.title;
							project.description = update.description ?? undefined;
							project.updated_at = now();
							resolve({ status: 200, body: structuredClone(project) });
							return { db };
						}),
					);
				},
			),

		Delete: ({ projectUUID }) =>
			requireProjectAccess(projectUUID, PERMISSIONS.MANAGE_PROJECT).then(
				(res) => {
					if (!res.ok) return { status: res.status, ...err };
					return prom((resolve) =>
						withDB((db) => {
							const colIds = db.column
								.filter((c) => c.project_uuid === projectUUID)
								.map((c) => c.id);
							db.tasks = db.tasks.filter(
								(t) =>
									t.column_id === undefined || !colIds.includes(t.column_id),
							);
							db.column = db.column.filter(
								(c) => c.project_uuid !== projectUUID,
							);
							db.member = db.member.filter(
								(m) => m.project_uuid !== projectUUID,
							);
							db.tag = db.tag.filter((t) => t.project_uuid !== projectUUID);
							db.role = db.role.filter(
								(r) => !(r.project_uuid && r.project_uuid === projectUUID),
							);
							db.project = db.project.filter((p) => p.uuid !== projectUUID);
							resolve({ status: 204 });
							return { db };
						}),
					);
				},
			),

		Columns: {
			GetAll: ({ projectUUID }) =>
				requireProjectAccess(projectUUID).then((res) => {
					if (!res.ok) return { status: res.status, ...err };
					return prom((resolve) =>
						withDB((db) => {
							const columns = db.column
								.filter((c) => c.project_uuid === projectUUID)
								.sort((a, b) => a.position - b.position);
							resolve({ status: 200, body: structuredClone(columns) });
							return { db };
						}),
					);
				}),

			Create: ({ projectUUID, ...create }) =>
				requireProjectAccess(projectUUID, PERMISSIONS.MANAGE_PROJECT).then(
					(res) => {
						if (!res.ok) return { status: res.status, ...err };
						return prom((resolve) =>
							withDB((db) => {
								const cols = db.column.filter(
									(c) => c.project_uuid === projectUUID,
								);
								const newCol: DBColumn = {
									id: nextId(db.column),
									project_uuid: projectUUID,
									position: cols.length,
									name: create.name,
									created_at: now(),
								};
								db.column.push(newCol);
								resolve({ status: 201, body: structuredClone(newCol) });
								return { db };
							}),
						);
					},
				),

			Get: ({ columnID }) =>
				prom((resolve) => {
					const { col } = withDB((db) => ({
						db,
						col: db.column.find((c) => c.id === columnID),
					}));
					if (col === undefined) {
						resolve({ status: 404 });
						return;
					}
					requireProjectAccess(col.project_uuid).then((res) => {
						if (res.ok) resolve({ status: 200, body: col });
						else resolve({ status: res.status, ...err });
					});
				}),

			Update: ({ columnID, ...update }) =>
				prom((resolve) => {
					const { col } = withDB((db) => ({
						db,
						col: db.column.find((c) => c.id === columnID),
					}));
					if (col === undefined) {
						resolve({ status: 404 });
						return;
					}
					requireProjectAccess(
						col.project_uuid,
						PERMISSIONS.MANAGE_PROJECT,
					).then((res) => {
						if (!res.ok) {
							resolve({ status: res.status, ...err });
							return;
						}
						withDB((db) => {
							const c = db.column.find((c) => c.id === columnID)!;
							c.name = update.name;
							resolve({ status: 200, body: structuredClone(c) });
							return { db };
						});
					});
				}),

			Move: ({ columnID, direction }) =>
				prom(async (resolve) => {
					const { col } = withDB((db) => ({
						db,
						col: db.column.find((col) => col.id == columnID),
					}));
					if (col === undefined) {
						resolve({ status: 404 });
						return;
					}
					const res = await requireProjectAccess(
						col.project_uuid,
						PERMISSIONS.MANAGE_PROJECT,
					);
					if (!res.ok) {
						resolve({ status: res.status, ...err });
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
						resolve({ status: 404 });
						return;
					}
					const { newCol } = withDB((db) => {
						const cur = db.column.find((c) => c.id === col.id)!;
						cur.position = other.position;
						const next = db.column.find((c) => c.id === other.id)!;
						next.position = col.position;
						return { db, newCol: cur };
					});
					resolve({ status: 200, body: newCol });
				}),

			Delete: ({ columnID }) =>
				prom(async (resolve) => {
					const { col } = withDB((db) => ({
						db,
						col: db.column.find((c) => c.id === columnID),
					}));
					if (col === undefined) {
						resolve({ status: 404 });
						return;
					}
					const res = await requireProjectAccess(
						col.project_uuid,
						PERMISSIONS.MANAGE_PROJECT,
					);
					if (!res.ok) {
						resolve({ status: res.status, ...err });
						return;
					}
					withDB((db) => {
						const idx = db.column.findIndex((c) => c.id === columnID);
						if (idx === -1) {
							resolve({ status: 404 });
							return { db };
						}
						db.column.splice(idx, 1);
						db.column.forEach((c) => {
							if (c.project_uuid !== col.project_uuid) return;
							if (c.position <= col.position) return;
							c.position -= 1;
						});
						db.tasks = db.tasks.filter((t) => t.column_id !== columnID);
						resolve({ status: 204 });
						return { db };
					});
				}),
		},

		// ---------- Members ----------
		Members: {
			GetAll: ({ projectUUID }) =>
				requireProjectAccess(projectUUID).then((res) => {
					if (!res.ok) return { status: res.status, ...err };
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
							resolve({ status: 200, body: apiMembers });
							return { db };
						}),
					);
				}),

			Create: ({ projectUUID, ...create }) =>
				requireProjectAccess(projectUUID, PERMISSIONS.MANAGE_MEMBERS).then(
					(res) => {
						if (!res.ok) return { status: res.status, ...err };
						return prom((resolve) =>
							withDB((db) => {
								const userExists = db.baseUser.some(
									(u) => u.uuid === create.user_uuid,
								);
								if (!userExists) {
									resolve({
										status: 400,
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
									resolve({ status: 409 });
									return { db };
								}
								const roleExists = db.role.some(
									(r) =>
										r.id === create.role_id &&
										(r.project_uuid === projectUUID || !r.project_uuid),
								);
								if (!roleExists) {
									resolve({
										status: 400,
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
									status: 201,
									body: { ...user, ...newMembership, role_id: role.id },
								});
								return { db };
							}),
						);
					},
				),

			Get: ({ projectUUID, userUUID }) =>
				requireProjectAccess(projectUUID).then((res) => {
					if (!res.ok) return { status: res.status, ...err };
					return prom((resolve) =>
						withDB((db) => {
							const m = db.member.find(
								(m) =>
									m.project_uuid === projectUUID && m.user_uuid === userUUID,
							);
							if (!m) {
								resolve({ status: 404 });
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
							resolve({ status: 200, body: apiMember });
							return { db };
						}),
					);
				}),

			Update: ({ projectUUID, userUUID, ...update }) =>
				requireProjectAccess(projectUUID, PERMISSIONS.MANAGE_MEMBERS).then(
					(res) => {
						if (!res.ok) return { status: res.status, ...err };
						return prom((resolve) =>
							withDB((db) => {
								const m = db.member.find(
									(m) =>
										m.project_uuid === projectUUID && m.user_uuid === userUUID,
								);
								if (!m) {
									resolve({ status: 404 });
									return { db };
								}
								if (update.role_id !== undefined) {
									const roleExists = db.role.some(
										(r) =>
											r.id === update.role_id &&
											(r.project_uuid === projectUUID || !r.project_uuid),
									);
									if (!roleExists) {
										resolve({ status: 400, ...err });
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
								resolve({ status: 200, body: apiMember });
								return { db };
							}),
						);
					},
				),

			Delete: async ({ projectUUID, userUUID }) => {
				const res = await requireProjectAccess(
					projectUUID,
					PERMISSIONS.MANAGE_MEMBERS,
				);
				if (!res.ok) return { status: res.status, ...err };
				return prom((resolve) =>
					withDB((db) => {
						const idx = db.member.findIndex(
							(m) => m.project_uuid === projectUUID && m.user_uuid === userUUID,
						);
						if (idx === -1) {
							resolve({ status: 404 });
							return { db };
						}
						db.member.splice(idx, 1);
						db.assignee = db.assignee.filter((a) => a.user_uuid !== userUUID);
						resolve({ status: 204 });
						return { db };
					}),
				);
			},
		},

		// ---------- Tasks ----------
		Tasks: {
			GetAll: ({ projectUUID }) =>
				requireProjectAccess(projectUUID).then((res) => {
					if (!res.ok) return { status: res.status, ...err };
					return prom((resolve) =>
						withDB((db) => {
							resolve({
								status: 200,
								body: db.tasks.filter((task) => task.deleted_at === undefined),
							});
							return { db };
						}),
					);
				}),

			Create: ({ projectUUID, ...rest }) =>
				requireAuth().then((auth) =>
					auth.ok
						? requireProjectAccess(projectUUID, PERMISSIONS.EDIT_TASKS).then(
								(res) => {
									if (!res.ok) return { status: res.status, ...err };
									return prom((resolve) =>
										withDB((db) => {
											const newTask: DBTask = {
												id: nextId(db.tasks),
												creator_uuid: auth.user.uuid,
												created_at: now(),
												updated_at: now(),
												...rest,
											};
											db.tasks.push(newTask);
											resolve({ status: 201, body: newTask });
											return { db };
										}),
									);
								},
							)
						: { status: 401, ...err },
				),

			Get: ({ projectUUID, taskID }) =>
				requireProjectAccess(projectUUID).then((res) => {
					if (!res.ok) return { status: res.status, ...err };
					return prom((resolve) =>
						withDB((db) => {
							const task = db.tasks.find((t) => t.id === taskID);
							if (task === undefined || task.deleted_at !== undefined) {
								resolve({ status: 404 });
								return { db };
							}
							resolve({ status: 200, body: task });
							return { db };
						}),
					);
				}),

			Update: ({ projectUUID, taskID, ...update }) =>
				requireProjectAccess(projectUUID, PERMISSIONS.EDIT_TASKS).then(
					(res) => {
						if (!res.ok) return { status: res.status, ...err };
						return prom((resolve) =>
							withDB((db) => {
								const task = db.tasks.find((t) => t.id === taskID);
								if (task === undefined || task.deleted_at !== undefined) {
									resolve({ status: 404 });
									return { db };
								}
								console.log(update);
								task.title = update.title ?? undefined;
								task.description = update.description ?? undefined;
								task.start_date = update.start_date ?? undefined;
								task.end_date = update.end_date ?? undefined;

								const newCol = db.column.find(
									(c) =>
										c.id === update.column_id && c.project_uuid === projectUUID,
								);
								if (newCol === undefined) {
									resolve({ status: 400, ...err });
									return { db };
								}
								task.column_id = update.column_id;

								task.archived_at = update.archived
									? task.archived_at === undefined
										? now()
										: task.archived_at
									: undefined;
								task.updated_at = now();
								resolve({ status: 200, body: task });
								return { db };
							}),
						);
					},
				),

			Delete: ({ projectUUID, taskID }) =>
				requireProjectAccess(projectUUID, PERMISSIONS.DELETE_TASKS).then(
					(res) => {
						if (!res.ok) return { status: res.status, ...err };
						return prom((resolve) =>
							withDB((db) => {
								const task = db.tasks.find((t) => t.id === taskID);
								if (task === undefined || task.deleted_at !== undefined) {
									resolve({ status: 404 });
									return { db };
								}
								task.deleted_at = now();
								resolve({ status: 204 });
								return { db };
							}),
						);
					},
				),

			Tags: {
				GetAll: async ({ taskID }) => {
					const { task } = withDB((db) => ({
						db,
						task: db.tasks.find((t) => t.id === taskID),
					}));
					if (task === undefined || task.deleted_at !== undefined)
						return { status: 404 };
					const { col } = withDB((db) => ({
						db,
						col: db.column.find((c) => task.column_id === c.id),
					}));
					if (col === undefined) return { status: 404 };
					const res = await requireProjectAccess(col.project_uuid);
					if (!res.ok) return { status: res.status, ...err };

					const { tags } = withDB((db) => {
						const tagIds = db.task_tag
							.filter((tt) => tt.task_id === taskID)
							.map((tt) => tt.tag_id);
						return { db, tags: db.tag.filter((t) => tagIds.includes(t.id)) };
					});
					return { status: 200, body: tags };
				},

				Create: async ({ taskID, tagID }) => {
					const { task } = withDB((db) => ({
						db,
						task: db.tasks.find((t) => t.id === taskID),
					}));
					if (task === undefined || task.deleted_at !== undefined)
						return { status: 404 };
					const { col } = withDB((db) => ({
						db,
						col: db.column.find((c) => task.column_id === c.id),
					}));
					if (col === undefined) return { status: 404 };
					const res = await requireProjectAccess(
						col.project_uuid,
						PERMISSIONS.EDIT_TASKS,
					);
					if (!res.ok) return { status: res.status, ...err };
					return await prom((resolve) =>
						withDB((db) => {
							const task = db.tasks.find((t) => t.id === taskID);
							if (task === undefined || task.deleted_at !== undefined) {
								resolve({ status: 404 });
								return { db };
							}
							const tag = db.tag.find(
								(t) => t.id === tagID && t.project_uuid === col.project_uuid,
							);
							if (tag === undefined) {
								resolve({ status: 404 });
								return { db };
							}
							const existing = db.task_tag.find(
								(tt) => tt.task_id === taskID && tt.tag_id === tagID,
							);
							if (existing) {
								resolve({ status: 409 });
								return { db };
							}
							db.task_tag.push({
								task_id: taskID,
								tag_id: tagID,
								added_at: now(),
							});
							resolve({ status: 204 });
							return { db };
						}),
					);
				},

				Delete: async ({ taskID, tagID }) => {
					const { task } = withDB((db) => ({
						db,
						task: db.tasks.find((t) => t.id === taskID),
					}));
					if (task === undefined || task.deleted_at !== undefined)
						return { status: 404 };
					const { col } = withDB((db) => ({
						db,
						col: db.column.find((c) => task.column_id === c.id),
					}));
					if (col === undefined) return { status: 404 };
					const res = await requireProjectAccess(
						col.project_uuid,
						PERMISSIONS.EDIT_TASKS,
					);
					if (!res.ok) return { status: res.status, ...err };
					return await prom((resolve) =>
						withDB((db) => {
							const task = db.tasks.find((t) => t.id === taskID);
							if (task === undefined || task.deleted_at !== undefined) {
								resolve({ status: 404 });
								return { db };
							}
							const idx = db.task_tag.findIndex(
								(tt) => tt.task_id === taskID && tt.tag_id === tagID,
							);
							if (idx === -1) {
								resolve({ status: 404 });
								return { db };
							}
							db.task_tag.splice(idx, 1);
							resolve({ status: 204 });
							return { db };
						}),
					);
				},
			},
		},

		// ---------- Assignees ----------
		Assignees: {
			GetAll: async ({ projectUUID, taskID }) => {
				const res = await requireProjectAccess(projectUUID);
				if (!res.ok) return { status: res.status, ...err };
				return prom((resolve) =>
					withDB((db) => {
						const task = db.tasks.find((t) => t.id === taskID);
						if (task === undefined || task.deleted_at !== undefined) {
							resolve({ status: 404 });
							return { db };
						}
						resolve({
							status: 200,
							body: db.assignee.filter((a) => a.task_id === taskID),
						});
						return { db };
					}),
				);
			},

			Create: async ({ projectUUID, taskID, user_uuid }) => {
				const res = await requireProjectAccess(
					projectUUID,
					PERMISSIONS.EDIT_TASKS,
				);
				if (!res.ok) return { status: res.status, ...err };
				return prom((resolve) =>
					withDB((db) => {
						const task = db.tasks.find((t) => t.id === taskID);
						if (task === undefined || task.deleted_at !== undefined) {
							resolve({ status: 404 });
							return { db };
						}
						const isMember = db.member.some(
							(m) =>
								m.project_uuid === projectUUID && m.user_uuid === user_uuid,
						);
						if (!isMember) {
							resolve({ status: 400, ...err });
							return { db };
						}
						const existing = db.assignee.find(
							(a) => a.task_id === taskID && a.user_uuid === user_uuid,
						);
						if (existing) {
							resolve({ status: 409 });
							return { db };
						}
						const newAssignment: DBAssignee = {
							task_id: taskID,
							user_uuid: user_uuid,
							assigned_at: now(),
						};
						db.assignee.push(newAssignment);
						resolve({ status: 201, body: newAssignment });
						return { db };
					}),
				);
			},

			Delete: async ({ projectUUID, taskID, userUUID }) => {
				const res = await requireProjectAccess(
					projectUUID,
					PERMISSIONS.EDIT_TASKS,
				);
				if (!res.ok) return { status: res.status, ...err };
				return prom((resolve) =>
					withDB((db) => {
						const task = db.tasks.find((t) => t.id === taskID);
						if (task === undefined || task.deleted_at !== undefined) {
							resolve({ status: 404 });
							return { db };
						}
						const idx = db.assignee.findIndex(
							(a) => a.task_id === taskID && a.user_uuid === userUUID,
						);
						if (idx === -1) {
							resolve({ status: 404 });
							return { db };
						}
						db.assignee.splice(idx, 1);
						resolve({ status: 204 });
						return { db };
					}),
				);
			},
		},

		// ---------- Tags (Project-level) ----------
		Tags: {
			GetAll: async ({ projectUUID }) => {
				const res = await requireProjectAccess(projectUUID);
				if (!res.ok) return { status: res.status, ...err };
				return prom((resolve) =>
					withDB((db) => {
						const tags = db.tag.filter((t) => t.project_uuid === projectUUID);
						resolve({ status: 200, body: tags });
						return { db };
					}),
				);
			},

			Create: async ({ projectUUID, ...create }) => {
				const res = await requireProjectAccess(
					projectUUID,
					PERMISSIONS.MANAGE_PROJECT,
				);
				if (!res.ok) return { status: res.status, ...err };
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
						resolve({ status: 201, body: newTag });
						return { db };
					}),
				);
			},

			Update: async ({ projectUUID, tagID, ...update }) => {
				const res = await requireProjectAccess(
					projectUUID,
					PERMISSIONS.MANAGE_PROJECT,
				);
				if (!res.ok) return { status: res.status, ...err };
				return prom((resolve) =>
					withDB((db) => {
						const tag = db.tag.find(
							(t) => t.id === tagID && t.project_uuid === projectUUID,
						);
						if (tag === undefined) {
							resolve({ status: 404 });
							return { db };
						}
						tag.name = update.name;
						tag.color = update.color;
						resolve({ status: 200, body: tag });
						return { db };
					}),
				);
			},

			Delete: async ({ projectUUID, tagID }) => {
				const res = await requireProjectAccess(
					projectUUID,
					PERMISSIONS.MANAGE_PROJECT,
				);
				if (!res.ok) return { status: res.status, ...err };
				return prom((resolve) =>
					withDB((db) => {
						const idx = db.tag.findIndex(
							(t) => t.id === tagID && t.project_uuid === projectUUID,
						);
						if (idx === -1) {
							resolve({ status: 404 });
							return { db };
						}
						db.tag.splice(idx, 1);
						db.task_tag = db.task_tag.filter((tt) => tt.tag_id !== tagID);
						resolve({ status: 204 });
						return { db };
					}),
				);
			},
		},

		// ---------- Roles ----------
		Roles: {
			GetAll: async ({ projectUUID }) => {
				const res = await requireProjectAccess(projectUUID);
				if (!res.ok) return { status: 403, ...err };
				return prom((resolve) =>
					withDB((db) => {
						const roles = db.role.filter(
							(r) =>
								r.project_uuid === projectUUID || r.project_uuid === undefined,
						);
						resolve({ status: 200, body: roles });
						return { db };
					}),
				);
			},

			Create: async ({ projectUUID, ...create }) => {
				const res = await requireProjectAccess(
					projectUUID,
					PERMISSIONS.MANAGE_ROLES,
				);
				if (!res.ok) return { status: 403, ...err };
				return prom((resolve) =>
					withDB((db) => {
						const newRole: DBRole = {
							id: nextId(db.role),
							project_uuid: projectUUID,
							name: create.name,
							description: create.description,
						};
						db.role.push(newRole);
						resolve({ status: 201, body: newRole });
						return { db };
					}),
				);
			},

			Get: async ({ projectUUID, roleID }) => {
				const res = await requireProjectAccess(projectUUID);
				if (!res.ok) return { status: res.status, ...err };
				return prom((resolve) =>
					withDB((db) => {
						const role = db.role.find(
							(r) =>
								r.id === roleID &&
								(r.project_uuid === projectUUID ||
									r.project_uuid === undefined),
						);
						if (role === undefined) {
							resolve({ status: 404 });
							return { db };
						}
						resolve({ status: 200, body: role });
						return { db };
					}),
				);
			},

			Update: async ({ projectUUID, roleID, ...update }) => {
				const res = await requireProjectAccess(
					projectUUID,
					PERMISSIONS.MANAGE_ROLES,
				);
				if (!res.ok) return { status: res.status, ...err };
				return prom((resolve) =>
					withDB((db) => {
						const role = db.role.find(
							(r) =>
								r.id === roleID &&
								(r.project_uuid === projectUUID || !r.project_uuid),
						);
						if (role === undefined) {
							resolve({ status: 404 });
							return { db };
						}
						role.name = update.name;
						role.description = update.description ?? undefined;
						resolve({ status: 200, body: role });
						return { db };
					}),
				);
			},

			Delete: async ({ projectUUID, roleID }) => {
				const res = await requireProjectAccess(
					projectUUID,
					PERMISSIONS.MANAGE_ROLES,
				);
				if (!res.ok) return { status: res.status, ...err };
				return prom((resolve) =>
					withDB((db) => {
						const idx = db.role.findIndex(
							(r) =>
								r.id === roleID &&
								(r.project_uuid === projectUUID ||
									r.project_uuid === undefined),
						);
						if (idx === -1) {
							resolve({ status: 404 });
							return { db };
						}
						const used = db.member.some(
							(m) => m.project_uuid === projectUUID && m.role_id === roleID,
						);
						if (used) {
							resolve({ status: 409 });
							return { db };
						}
						db.role.splice(idx, 1);
						db.role_permissions = db.role_permissions.filter(
							(rp) => rp.role_id !== roleID,
						);
						resolve({ status: 204 });
						return { db };
					}),
				);
			},

			Permissions: {
				GetAll: async ({ projectUUID, roleID }) => {
					const res = await requireProjectAccess(projectUUID);
					if (!res.ok) return { status: res.status, ...err };
					return prom((resolve) =>
						withDB((db) => {
							const role = db.role.find(
								(r) =>
									r.id === roleID &&
									(r.project_uuid === projectUUID || !r.project_uuid),
							);
							if (!role) {
								resolve({ status: 404 });
								return { db };
							}
							const permIds = db.role_permissions
								.filter((rp) => rp.role_id === roleID)
								.map((rp) => rp.permission_id);
							const permissions = db.permission.filter((p) =>
								permIds.includes(p.id),
							);
							resolve({ status: 200, body: permissions });
							return { db };
						}),
					);
				},
			},
		},
	},
};
