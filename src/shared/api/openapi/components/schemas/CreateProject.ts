import type { Nullable } from "./nullable";

export type CreateProject = {
  title: string;
  description: Nullable<string>;
};
