import type { APIAdapter } from "./adapter";
import BackendAPI from "./adapters/backend";
import LocalStorageAPI from "./adapters/localStoarge";

export const API: APIAdapter = import.meta.env.PROD ? BackendAPI : LocalStorageAPI;