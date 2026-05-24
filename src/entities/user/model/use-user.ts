import { useQuery } from "@tanstack/react-query";
import { API, QueryKeys } from "../../../shared";

export const useUser = () =>
	useQuery({
		queryKey: QueryKeys.self,
		queryFn: async ({ signal }) => {
			const res = await API.User.GetSelf({}, signal);
			if (res.status === 200) return res.body;
			return null;
		},
		retry: false,
	});
