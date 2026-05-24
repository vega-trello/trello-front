import type { UUID } from "../api/openapi/components/schemas";
import type { integer } from "../api/openapi/components/schemas/integer";

export const QueryKeys = {
	self: ["user", "self"] as const,
	projects: ["projects"] as const,
	project: (uuid: UUID) => ["project", uuid] as const,
	columns: (projectUUID: UUID) => ["project", projectUUID, "columns"] as const,
	column: (columnID: integer) => ["column", columnID] as const,
	tasks: (projectUUID: UUID) => ["project", projectUUID, "tasks"] as const,
	task: (projectUUID: UUID, taskID: integer) =>
		["project", projectUUID, "task", taskID] as const,
};
