const TOKEN_KEY = "acc_tok";

export const tokenStorage = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (tok: string) => sessionStorage.setItem(TOKEN_KEY, tok),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};
