import { Navigate, Outlet } from "react-router";
import useUser from "../entities/user/model/use-user";

function RequireAuth() {
  const user = useUser();

  if (user === undefined) return null;
  if (user === null) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default RequireAuth;
