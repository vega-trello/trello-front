import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import type { SelfUser } from "../../../shared/api/openapi/components/schemas";
import { API } from "../../../shared";

export function useUser() {
  const [user, setUser] = useState<SelfUser | null | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    API.User.GetSelf({}).then((res) => {
      if (res.status === 200) setUser(res.body);
    });
  }, [location.pathname]);

  return user;
}
