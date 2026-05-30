import { tokenStorage } from "../../token-storage";
import type {
	Param,
	QueryParam,
	PathParam,
} from "../components/parameters/parameter";
import type { Response } from "../components/responses/response";

const base = `${window.location.protocol}//${window.location.hostname}:8080`;

type Transform<T extends Record<number, Response<unknown>>> = {
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

export function GET<
	Params extends Param<string>[],
	R extends Record<number, Response<unknown>> = {},
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
		let url = rawUrl;
		for (const key in path) {
			const param = path[key as keyof typeof path] as string;
			url = url.replace(`{${String(key)}}`, param);
		}
		const input = new URL(url, base);
		for (const key in query) {
			input.searchParams.set(key, query[key as keyof typeof query] as string);
		}

		const res = await _fetch(input, {
			method: "GET",
			signal,
		});
		const body = await res.json();

		return {
			status: res.status,
			body,
		} as unknown as Transform<R>;
	};
}

export function POST<
	Params extends Param<string>[],
	Body,
	R extends Record<number, Response<unknown>> = {},
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
		let url = rawUrl;
		for (const key in path) {
			const param = path[key as keyof typeof path] as string;
			url = url.replace(`{${String(key)}}`, param);
		}
		const input = new URL(url, base);
		for (const key in query) {
			input.searchParams.set(key, query[key as keyof typeof query] as string);
		}

		const res = await _fetch(input, {
			method: "POST",
			body: JSON.stringify(body),
			signal,
		});
		const data = await res.json();

		return {
			status: res.status,
			body: data,
		} as unknown as Transform<R>;
	};
}

export function PATCH<
	Params extends Param<string>[],
	Body,
	R extends Record<number, Response<unknown>> = {},
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
		let url = rawUrl;
		for (const key in path) {
			const param = path[key as keyof typeof path] as string;
			url = url.replace(`{${String(key)}}`, param);
		}
		const input = new URL(url, base);
		for (const key in query) {
			input.searchParams.set(key, query[key as keyof typeof query] as string);
		}

		const res = await _fetch(input, {
			method: "PATCH",
			body: JSON.stringify(body),
			signal,
		});
		const data = await res.json();

		return {
			status: res.status,
			body: data,
		} as unknown as Transform<R>;
	};
}

export function DELETE<
	Params extends Param<string>[],
	R extends Record<number, Response<unknown>> = {},
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
		let url = rawUrl;
		for (const key in path) {
			const param = path[key as keyof typeof path] as string;
			url = url.replace(`{${String(key)}}`, param);
		}
		const input = new URL(url, base);
		for (const key in query) {
			input.searchParams.set(key, query[key as keyof typeof query] as string);
		}

		const res = await _fetch(input, {
			method: "DELETE",
			signal,
		});
		const body = await res.json();

		return {
			status: res.status,
			body,
		} as unknown as Transform<R>;
	};
}
