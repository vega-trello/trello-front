import type { Error } from "../api/openapi/components/schemas";

export function errorMessage<
	T extends { status: number; body: Error } | { status: number },
>(err: T): { title: string; description?: string } {
	console.error(err);
	return "body" in err
		? {
				title: err.body.error,
				description: err.body.message,
			}
		: {
				title: "Что-то пошло не так",
			};
}
