// const API_VERSION = "v1";
// const baseURL = new URL(`/api/${API_VERSION}/`, window.location.origin);

// type NoLeadingSlash<T extends string> = T extends `/${string}` ? never : T;

function _use(...variables: unknown[]): unknown[] {
  return variables;
}

// function GET<E extends string>(endpoint: NoLeadingSlash<E>) {
//   const url = new URL(endpoint, baseURL);
//   return fetch(url, {
//     method: "GET",
//   });
// }

// function POST<E extends string>(
//   endpoint: NoLeadingSlash<E>,
//   json?: Record<string, unknown>,
// ) {
//   const url = new URL(endpoint, baseURL);
//   return fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: json ? JSON.stringify(json) : null,
//   });
// }

function getUser(): User | null {
  const raw = localStorage.getItem("user");
  if (raw === null) {
    return null;
  }
  return JSON.parse(raw) as User;
}

function setUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

async function GetUser(): Promise<User | null> {
  return Promise.resolve(getUser());
}

async function Register(
  username: string,
  password: string,
): Promise<RegisterResponse> {
  _use(username, password);
  setUser({
    uuid: crypto.randomUUID(),
    username,
    createdAt: new Date(),
  });
  return Promise.resolve({
    ok: true,
  });
}

async function Login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  _use(username, password);
  setUser({
    uuid: crypto.randomUUID(),
    username,
    createdAt: new Date(),
  });
  return Promise.resolve({
    ok: true,
  });
}

async function GetProject(uuid: string): Promise<Project> {
  _use(uuid);
  return Promise.resolve({
    uuid: "a844ef20-782a-4e4c-9734-0670a09797d8",
    title: "Покорение Веги",
    createdAt: new Date(2000, 0, 1, 0, 0, 1),
    updatedAt: new Date(),
  });
}

async function GetColumns(projectUUID: string): Promise<Column[]> {
  _use(projectUUID);
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

const API = { GetUser, Register, Login, GetColumns, GetProject, Logout };
export default API;
