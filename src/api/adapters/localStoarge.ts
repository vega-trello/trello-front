import type { APIAdapter } from "../adapter";

type DB = {
  user: {
    uuid: UUID;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  project: {
    uuid: UUID;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  projectMember: {
    projectUUID: UUID;
    userUUID: UUID;
    roleID: number;
    joinedAt: Date;
  }[];
  role: {
    id: number;
    projectUUID?: UUID;
    name: string;
    description?: string;
  }[];
};

function _r<T>(v: T): Promise<T> {
  return Promise.resolve(v);
}

function _p<T>(v: string): T {
  return JSON.parse(v) as T;
}

function _s(v: unknown): string {
  return JSON.stringify(v);
}

function prom<T>(
  cb: (resolve: (v: T | Promise<T>) => void) => void,
): Promise<T> {
  return new Promise<T>(cb);
}

function withDB(cb: (db: DB) => DB) {
  const raw = localStorage.getItem("db");
  const db: DB =
    raw === null
      ? {
          user: [],
          project: [],
          role: [
            {
              id: 0,
              name: "Создатель",
            },
          ],
          projectMember: [],
        }
      : _p<DB>(raw);
  const res = cb(db);
  localStorage.setItem("db", _s(res));
}

async function GetUser(): Promise<User | null> {
  const raw = localStorage.getItem("user");
  if (raw === null) return _r(null);
  const user = _p<User>(raw);
  return _r(user);
}

async function Register(
  username: string,
  password: string,
): Promise<RegisterResponse> {
  return prom((resolve) => {
    withDB((db) => {
      for (const user of db.user) {
        if (user.username === username) {
          resolve({
            ok: false,
            reason: "username",
          });
          return db;
        }
      }
      const user: DB["user"][number] = {
        uuid: crypto.randomUUID(),
        username,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db["user"].push(user);
      resolve({ ok: true });

      return db;
    });
  });
}

async function Login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  return prom((resolve) => {
    withDB((db) => {
      for (const user of db.user) {
        if (user.username !== username) continue;

        if (user.password !== password) {
          resolve({
            ok: false,
            reason: "credentials",
          });
          return db;
        }
        localStorage.setItem("user", _s(user));
        resolve({
          ok: true,
        });
        return db;
      }

      resolve({
        ok: false,
        reason: "credentials",
      });
      return db;
    });
  });
}

async function CreateProject(
  proj: Omit<DB["project"][number], "uuid" | "createdAt" | "updatedAt">,
): Promise<Project | null> {
  return prom(async (resolve) => {
    const user = await GetUser();
    if (user === null) {
      resolve(null);
      return;
    }

    withDB((db) => {
      const project: DB["project"][number] = {
        ...proj,
        uuid: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const member: DB["projectMember"][number] = {
        userUUID: user.uuid,
        projectUUID: project.uuid,
        roleID: 0,
        joinedAt: new Date(),
      };
      db.project.push(project);
      db.projectMember.push(member);
      resolve(project);
      return db;
    });
  });
}

function getProjectMembers(projectUUID: UUID): DB["projectMember"][number][] {
  const res: DB["projectMember"][number][] = [];
  withDB((db) => {
    for (const member of db.projectMember) {
      if (member.projectUUID !== projectUUID) continue;

      res.push(member);
    }
    return db;
  });
  return res;
}

function isMemberOf(userUUID: UUID, projectUUID: UUID): boolean {
  let res = false;
  withDB((db) => {
    for (const member of db.projectMember) {
      if (member.projectUUID === projectUUID && member.userUUID === userUUID) {
        res = true;
        return db;
      }
    }
    return db;
  });
  return res;
}

async function GetProjectMembers(
  projectUUID: UUID,
): Promise<DB["projectMember"][number][] | null> {
  return prom(async (resolve) => {
    const user = await GetUser();
    if (user === null) {
      resolve(null);
      return;
    }
    if (!isMemberOf(user.uuid, projectUUID)) {
      resolve(null);
      return;
    }

    resolve(getProjectMembers(projectUUID));
    return;
  });
}

async function GetProjects(): Promise<Project[] | null> {
  return prom(async (resolve) => {
    const user = await GetUser();
    if (user === null) {
      resolve(null);
      return;
    }

    const res: Project[] = [];
    withDB((db) => {
      for (const project of db.project) {
        if (!isMemberOf(user.uuid, project.uuid)) continue;
        res.push({
          uuid: project.uuid,
          title: project.title,
          description: project.description,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        });
      }
      return db;
    });
    resolve(res);
  });
}

async function GetProject(uuid: string): Promise<Project | null> {
  return prom((resolve) => {
    withDB((db) => {
      for (const project of db.project) {
        if (project.uuid !== uuid) continue;
        // TODO only your projects
        resolve(project);
        return db;
      }
      resolve(null);
      return db;
    });
  });
}

async function GetColumns(projectUUID: UUID): Promise<Column[]> {
  const res: Column[] = [
    {
      id: 1,
      projectUUID,
      name: "Backend",
      position: 1,
      createdAt: new Date(2022, 1, 1),
    },
    {
      id: 2,
      projectUUID,
      name: "Frontend",
      position: 2,
      createdAt: new Date(2022, 1, 2),
    },
    {
      id: 3,
      projectUUID,
      name: "FAQ",
      position: 0,
      createdAt: new Date(2021, 0, 1),
    },
  ];
  return Promise.resolve(res);
}

async function Logout(): Promise<void> {
  localStorage.removeItem("user");
  return Promise.resolve();
}

const LocalStorageAPI: APIAdapter = {
  GetUser,
  Register,
  Login,
  GetColumns,
  GetProjectMembers,
  CreateProject,
  GetProjects,
  GetProject,
  Logout,
};
export default LocalStorageAPI;
