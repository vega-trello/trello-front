import type { APIAdapter } from "../adapter";
import {
	AssigneeCreate,
	AssigneeDelete,
	AssigneeGetAll,
	AuthLogin,
	AuthLogout,
	AuthRegister,
	ColumnCreate,
	ColumnDelete,
	ColumnGet,
	ColumnGetAll,
	ColumnMove,
	ColumnUpdate,
	MemberCreate,
	MemberDelete,
	MemberGet,
	MemberGetAll,
	MemberUpdate,
	ProjectCreate,
	ProjectDelete,
	ProjectGet,
	ProjectGetAll,
	ProjectUpdate,
	RoleCreate,
	RoleDelete,
	RoleGet,
	RoleGetAll,
	RolePermissionGetAll,
	RoleUpdate,
	TagCreate,
	TagDelete,
	TagGetAll,
	TagUpdate,
	TaskCreate,
	TaskDelete,
	TaskGet,
	TaskGetAll,
	TaskTagCreate,
	TaskTagDelete,
	TaskTagGetAll,
	TaskUpdate,
	SelfGet,
	SelfUpdate,
	UserGet,
} from "../openapi/paths/paths";

const s = (n: number) => n.toString();

export const Adapter: APIAdapter = {
	Auth: {
		Register: ({ username, password }, signal) =>
			AuthRegister({}, {}, { username, password }, signal),
		Login: ({ username, password }, signal) =>
			AuthLogin(username, password, signal),
		Logout: (_, signal) => AuthLogout({}, {}, {}, signal),
	},
	Self: {
		Get: (_, signal) => SelfGet({}, {}, signal),
		Update: ({ ...rest }, signal) => SelfUpdate({}, {}, rest, signal),
	},
	User: {
		Get: ({ userUUID }, signal) => UserGet({}, { userUUID }, signal),
	},
	Project: {
		GetAll: (_, signal) => ProjectGetAll({}, {}, signal),
		Create: (req, signal) => ProjectCreate({}, {}, req, signal),
		Get: ({ projectUUID }, signal) => ProjectGet({ projectUUID }, {}, signal),
		Update: ({ projectUUID, ...rest }, signal) =>
			ProjectUpdate({ projectUUID }, {}, rest, signal),
		Delete: ({ projectUUID }, signal) =>
			ProjectDelete({ projectUUID }, {}, signal),
		Columns: {
			GetAll: ({ projectUUID }, signal) =>
				ColumnGetAll({ projectUUID }, {}, signal),
			Create: ({ projectUUID, ...rest }, signal) =>
				ColumnCreate({ projectUUID }, {}, rest, signal),
			Get: ({ columnID }, signal) =>
				ColumnGet({ columnID: s(columnID) }, {}, signal),
			Update: ({ columnID, ...rest }, signal) =>
				ColumnUpdate({ columnID: s(columnID) }, {}, rest, signal),
			Move: ({ columnID, direction }, signal) =>
				ColumnMove({ columnID: s(columnID) }, {}, { direction }, signal),
			Delete: ({ columnID }, signal) =>
				ColumnDelete({ columnID: s(columnID) }, {}, signal),
		},
		Members: {
			GetAll: ({ projectUUID }, signal) =>
				MemberGetAll({ projectUUID }, {}, signal),
			Create: ({ projectUUID, ...rest }, signal) =>
				MemberCreate({ projectUUID }, {}, rest, signal),
			Get: ({ projectUUID, userUUID }, signal) =>
				MemberGet({ projectUUID }, { userUUID }, signal),
			Update: ({ projectUUID, userUUID, ...rest }, signal) =>
				MemberUpdate({ projectUUID }, { userUUID }, rest, signal),
			Delete: ({ projectUUID, userUUID }, signal) =>
				MemberDelete({ projectUUID }, { userUUID }, signal),
		},
		Tasks: {
			GetAll: ({ projectUUID }, signal) =>
				TaskGetAll({ projectUUID }, {}, signal),
			Create: ({ projectUUID, ...rest }, signal) =>
				TaskCreate({ projectUUID }, {}, rest, signal),
			Get: ({ projectUUID, taskID }, signal) =>
				TaskGet({ projectUUID }, { taskID: s(taskID) }, signal),
			Update: ({ projectUUID, taskID, ...rest }, signal) =>
				TaskUpdate({ projectUUID }, { taskID: s(taskID) }, rest, signal),
			Delete: ({ projectUUID, taskID }, signal) =>
				TaskDelete({ projectUUID }, { taskID: s(taskID) }, signal),

			Tags: {
				GetAll: ({ taskID }, signal) =>
					TaskTagGetAll({}, { taskID: s(taskID) }, signal),
				Create: ({ taskID, tagID, ...rest }, signal) =>
					TaskTagCreate(
						{},
						{ taskID: s(taskID), tagID: s(tagID) },
						rest,
						signal,
					),
				Delete: ({ taskID, tagID }, signal) =>
					TaskTagDelete({}, { taskID: s(taskID), tagID: s(tagID) }, signal),
			},
		},
		Assignees: {
			GetAll: ({ projectUUID, taskID }, signal) =>
				AssigneeGetAll({ projectUUID }, { taskID: s(taskID) }, signal),
			Create: ({ projectUUID, taskID, ...rest }, signal) =>
				AssigneeCreate({ projectUUID }, { taskID: s(taskID) }, rest, signal),
			Delete: ({ projectUUID, taskID, userUUID }, signal) =>
				AssigneeDelete(
					{ projectUUID },
					{ userUUID, taskID: s(taskID) },
					signal,
				),
		},
		Tags: {
			GetAll: ({ projectUUID }, signal) =>
				TagGetAll({ projectUUID }, {}, signal),
			Create: ({ projectUUID, ...rest }, signal) =>
				TagCreate({ projectUUID }, {}, rest, signal),
			Update: ({ projectUUID, tagID, ...rest }, signal) =>
				TagUpdate({ projectUUID }, { tagID: s(tagID) }, rest, signal),
			Delete: ({ projectUUID, tagID }, signal) =>
				TagDelete({ projectUUID }, { tagID: s(tagID) }, signal),
		},
		Roles: {
			GetAll: ({ projectUUID }, signal) =>
				RoleGetAll({ projectUUID }, {}, signal),
			Create: ({ projectUUID, ...rest }, signal) =>
				RoleCreate({ projectUUID }, {}, rest, signal),
			Get: ({ projectUUID, roleID }, signal) =>
				RoleGet({ projectUUID, roleID: s(roleID) }, {}, signal),
			Update: ({ projectUUID, roleID, ...rest }, signal) =>
				RoleUpdate({ projectUUID, roleID: s(roleID) }, {}, rest, signal),
			Delete: ({ projectUUID, roleID }, signal) =>
				RoleDelete({ projectUUID, roleID: s(roleID) }, {}, signal),

			Permissions: {
				GetAll: ({ projectUUID, roleID }, signal) =>
					RolePermissionGetAll({ projectUUID, roleID: s(roleID) }, {}, signal),
			},
		},
	},
};
