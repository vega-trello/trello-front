import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ErrorResponse, SuccessBody } from "../api/types";

export function useApiMutation<
	TEndpoint extends (...args: any[]) => any,
	TVariables extends Parameters<TEndpoint>[0],
	TStatus extends number,
>(
	endpoint: TEndpoint,
	successStatus: TStatus,
	opts: Omit<
		UseMutationOptions<
			SuccessBody<TEndpoint, TStatus>,
			ErrorResponse<TEndpoint>,
			TVariables
		>,
		"mutationFn"
	>,
) {
	return useMutation<
		SuccessBody<TEndpoint, TStatus>,
		ErrorResponse<TEndpoint>,
		TVariables
	>({
		mutationFn: async (variables) => {
			const res = await endpoint(variables);
			if (res.status !== successStatus) throw res;
			return (res as any).body;
		},
		...opts,
	});
}
