import type { integer } from "./integer";

export type Permission = {
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
	description?: string;
};
