import type { Datetime } from "./datetime";
import type { Tag } from "./Tag";
import type { Task } from "./Task";

export type TaskTag = {
  task: Task;
  tag: Tag;
  created_at: Datetime;
};
