export type Response<T> = {
  body: T;
};

export type EmptyResponse = Response<undefined>;
