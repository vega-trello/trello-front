import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import API from "../api/api";

export default function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    API.GetUser().then(setUser);
  }, [location.pathname]);

  return user;
}
