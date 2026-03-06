type ResError<T> = T | "general";
type RegisterResponse =
  | {
      ok: true;
    }
  | { ok: false; reason: ResError<"username"> };

type LoginResponse =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: ResError<"credentials">;
    };