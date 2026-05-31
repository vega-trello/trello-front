import type { integer } from "./integer";
import type { Nullable } from "./nullable";

export type CreateColumn = {
  name: string;
  position: Nullable<integer>;
};
