const KEY = "sess_tok";

export const tokenStorage = {
	get: () => sessionStorage.getItem(KEY),
	set: (tok: string) => sessionStorage.setItem(KEY, tok),
	clear: () => sessionStorage.removeItem(KEY),
};
