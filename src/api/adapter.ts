// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Promisify<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => Promise<ReturnType<T[K]>>;
};

export type Omit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };

export type APIAdapter = Promisify<{
  GetUser: () => User | null;
  Register: (username: string, password: string) => RegisterResponse;
  Login: (username: string, password: string) => LoginResponse;
  GetProjectMembers: (projectUUID: UUID) => Member[] | null;
  CreateProject: (
    proj: Omit<Project, "uuid" | "createdAt" | "updatedAt">,
  ) => Project | null;
  GetProjects: () => Project[] | null;
  GetProject: (uuid: UUID) => Project | null;
  GetColumns: (projectUUID: UUID) => Column[];
  Logout: () => void;
}>;
