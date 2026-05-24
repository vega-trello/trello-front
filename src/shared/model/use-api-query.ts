import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ErrorResponse, SuccessBody } from "../api/types";

export function useApiQuery<
	TEndpoint extends (...args: any[]) => any,
	TVariables extends Parameters<TEndpoint>[0],
	TStatus extends number,
>(
	endpoint: TEndpoint,
	successStatus: TStatus,
	req: TVariables,
	opts: Omit<
		UseQueryOptions<SuccessBody<TEndpoint, TStatus>, ErrorResponse<TEndpoint>>,
		"queryFn"
	>,
) {
	return useQuery<SuccessBody<TEndpoint, TStatus>, ErrorResponse<TEndpoint>>({
		queryFn: async ({ signal }) => {
			const res = await endpoint(req, signal);
			if (res.status !== successStatus) throw res;
			return (res as any).body;
		},
		...opts,
	});
}
