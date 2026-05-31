import { tokenStorage } from "../../token-storage";
import type {
	Param,
	QueryParam,
	PathParam,
} from "../components/parameters/parameter";
import type { Response as _Response } from "../components/responses/response";

const base = `${window.location.protocol}//${window.location.hostname}:8080`;

type Transform<T extends Record<number, _Response<unknown>>> = {
	[K in keyof T]: T[K] & {
		status: K;
	};
}[keyof T];

function _fetch(input: URL | RequestInfo, init: RequestInit) {
	const token = tokenStorage.get();
	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		...(init.headers as Record<string, string>),
	};
	init.headers = headers;
	return fetch(input, init);
}

async function parseBody(res: Response) {
	try {
		return await res.json();
	} catch {
		return undefined;
	}
}

function buildURL<
	Params extends Param<string>[],
	P extends {
		[K in Params[number] as K extends PathParam<infer T> ? T : never]: string;
	},
	Q extends {
		[K in Params[number] as K extends QueryParam<infer T> ? T : never]: string;
	},
>(rawURL: string, path: P, query: Q) {
	let url = rawURL;
	for (const key in path) {
		url = url.replace(
			`{${String(key)}}`,
			path[key as keyof typeof path] as string,
		);
	}
	const result = new URL(url, base);
	for (const key in query)
		result.searchParams.set(key, query[key as keyof typeof query] as string);
	return result;
}

export function GET<
	Params extends Param<string>[],
	R extends Record<number, _Response<unknown>> = {},
>(
	rawUrl: string,
): (
	path: {
		[K in Params[number] as K extends PathParam<infer T> ? T : never]: string;
	},
	query: {
		[K in Params[number] as K extends QueryParam<infer T> ? T : never]: string;
	},
	signal?: AbortSignal,
) => Promise<Transform<R>> {
	return async (path, query, signal) => {
		const url = buildURL(rawUrl, path, query);

		const res = await _fetch(url, {
			method: "GET",
			signal,
		});
		const body = parseBody(res);

		return {
			status: res.status,
			body,
		} as unknown as Transform<R>;
	};
}

export function POST<
	Params extends Param<string>[],
	Body,
	R extends Record<number, _Response<unknown>> = {},
>(
	rawUrl: string,
): (
	path: {
		[K in Params[number] as K extends PathParam<infer T> ? T : never]: string;
	},
	query: {
		[K in Params[number] as K extends QueryParam<infer T> ? T : never]: string;
	},
	body: Body,
	signal?: AbortSignal,
) => Promise<Transform<R>> {
	return async (path, query, body, signal) => {
		const url = buildURL(rawUrl, path, query);

		const res = await _fetch(url, {
			method: "POST",
			body: JSON.stringify(body),
			signal,
		});
		const data = parseBody(res);

		return {
			status: res.status,
			body: data,
		} as unknown as Transform<R>;
	};
}

export function PATCH<
	Params extends Param<string>[],
	Body,
	R extends Record<number, _Response<unknown>> = {},
>(
	rawUrl: string,
): (
	path: {
		[K in Params[number] as K extends PathParam<infer T> ? T : never]: string;
	},
	query: {
		[K in Params[number] as K extends QueryParam<infer T> ? T : never]: string;
	},
	body: Body,
	signal?: AbortSignal,
) => Promise<Transform<R>> {
	return async (path, query, body, signal) => {
		const url = buildURL(rawUrl, path, query);

		const res = await _fetch(url, {
			method: "PATCH",
			body: JSON.stringify(body),
			signal,
		});
		const data = parseBody(res);

		return {
			status: res.status,
			body: data,
		} as unknown as Transform<R>;
	};
}

export function DELETE<
	Params extends Param<string>[],
	R extends Record<number, _Response<unknown>> = {},
>(
	rawUrl: string,
): (
	path: {
		[K in Params[number] as K extends PathParam<infer T> ? T : never]: string;
	},
	query: {
		[K in Params[number] as K extends QueryParam<infer T> ? T : never]: string;
	},
	signal?: AbortSignal,
) => Promise<Transform<R>> {
	return async (path, query, signal) => {
		const url = buildURL(rawUrl, path, query);

		const res = await _fetch(url, {
			method: "DELETE",
			signal,
		});
		const body = parseBody(res);

		return {
			status: res.status,
			body,
		} as unknown as Transform<R>;
	};
}
