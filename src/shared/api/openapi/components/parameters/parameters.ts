import type { QueryParam, PathParam } from "./parameter";

export type RoleID = PathParam<"roleID">;
export type ProjectUUID = PathParam<"projectUUID">;
export type TaskID = QueryParam<"taskID">;
export type TagID = QueryParam<"tagID">;
export type UserUUID = QueryParam<"userUUID">;
export type ColumnID = PathParam<"columnID">;
