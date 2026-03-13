import type { APIAdapter } from "./adapter";
import BackendAPI from "./adapters/backend";
import LocalStorageAPI from "./adapters/localStoarge";

const API: APIAdapter = import.meta.env.PROD ? BackendAPI : LocalStorageAPI;
export default API;
