import { redirect } from "react-router";

const API_VERSION = "v1";
const baseURL = new URL(`/api/${API_VERSION}/`, window.location.origin);

type NoLeadingSlash<T extends string> = T extends `/${string}` ? never : T;

function GET<E extends string>(endpoint: NoLeadingSlash<E>) {
  const url = new URL(endpoint, baseURL);
  return fetch(url, {
    method: "GET",
  });
}

function POST<E extends string>(
  endpoint: NoLeadingSlash<E>,
  json?: Record<string, unknown>,
) {
  const url = new URL(endpoint, baseURL);
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: json ? JSON.stringify(json) : null,
  });
}

async function Logout(): Promise<boolean> {
  const res = await POST("logout");
  if (res.ok) {
    redirect("/login");
    return true;
  }
  return false;
}

const API = { Logout };
export default API;
