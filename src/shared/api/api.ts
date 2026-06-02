import type { APIAdapter } from "./adapter";
import { Adapter as BackendAdapter } from "./adapters/backend";
import { Adapter as LocalStorageAdapter } from "./adapters/frontend";

export const API: APIAdapter =
	import.meta.env.MODE === "gh-pages"
		? LocalStorageAdapter
		: import.meta.env.MODE === "test" || import.meta.env.MODE === "prod"
			? BackendAdapter
			: LocalStorageAdapter;
