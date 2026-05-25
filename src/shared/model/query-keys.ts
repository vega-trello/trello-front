import type { UUID } from "../api/openapi/components/schemas";
import type { integer } from "../api/openapi/components/schemas/integer";

export const QueryKeys = {
	self: ["self"] as const,
	user: (uuid: UUID) => ["user", uuid] as const,
	projects: ["projects"] as const,
	project: (uuid: UUID) => ["project", uuid] as const,
	columns: (projectUUID: UUID) => ["project", projectUUID, "columns"] as const,
	column: (columnID: integer) => ["column", columnID] as const,
	tasks: (projectUUID: UUID) => ["project", projectUUID, "tasks"] as const,
	task: (taskID: integer) => ["task", taskID] as const,
	tags: (projectUUID: UUID) => ["project", projectUUID, "tags"] as const,
	tag: (projectUUID: UUID, tagID: integer) =>
		["project", projectUUID, "tag", tagID] as const,
	statuses: (projectUUID: UUID) =>
		["project", projectUUID, "statuses"] as const,
	status: (projectUUID: UUID, statusID: integer) =>
		["project", projectUUID, "status", statusID] as const,
	taskTags: (taskID: integer) => ["task", taskID, "tags"] as const,
};
