import type { APIAdapter } from "./adapter";
// import { Adapter as BackendAdapter } from "./adapters/backend";
import { Adapter as LocalStorageAdapter } from "./adapters/frontend";

// export const API: APIAdapter = import.meta.env.PROD
// 	? BackendAdapter
// 	: LocalStorageAdapter;
export const API: APIAdapter = LocalStorageAdapter;
