export type PathParam<T extends string> = {
  in: "path";
  name: T;
};
export type QueryParam<T extends string> = {
  in: "query";
  name: T;
};
export type Param<T extends string> = PathParam<T> | QueryParam<T>;
