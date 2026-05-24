type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type SuccessBody<
	Endpoint extends (req: any, signal?: AbortSignal) => unknown,
	Status extends number,
> =
	Extract<
		UnwrapPromise<ReturnType<Endpoint>>,
		{ status: Status }
	> extends infer M
		? M extends { body: infer B }
			? B
			: undefined
		: never;

export type ErrorResponse<Endpoint extends (req: any, signal?: AbortSignal) => unknown> =
	UnwrapPromise<ReturnType<Endpoint>> extends infer U
		? U extends { status: infer S }
			? S extends number
				? `${S}` extends `2${string}`
					? never
					: U
				: U
			: U
		: never;
