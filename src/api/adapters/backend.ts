// const API_VERSION = "v1";
// const baseURL = new URL(`/api/${API_VERSION}/`, window.location.origin);

import type { APIAdapter } from "../adapter";

// type NoLeadingSlash<T extends string> = T extends `/${string}` ? never : T;

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

function _use(...variables: unknown[]): unknown[] {
  return variables;
}

const BackendAPI: APIAdapter = {
  GetUser() {
    return Promise.resolve(null);
  },
  GetColumns(projectUUID) {
    _use(projectUUID);
    return Promise.resolve([]);
  },
  GetProject(uuid) {
    _use(uuid);
    return Promise.resolve({
      uuid: "",
      createdAt: new Date(),
      title: "",
      updatedAt: new Date(),
    });
  },
  Register(username, password) {
    _use(username, password);
    return Promise.resolve({ ok: true });
  },
  Login(username, password) {
    _use(username, password);
    return Promise.resolve({ ok: true });
  },
  Logout() {
    return Promise.resolve();
  },
};
export default BackendAPI;
