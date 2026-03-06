import { Navigate } from "react-router";
import useUser from "../hooks/useUser";

function RootRedirect() {
  const user = useUser();
  if (user === null || user === undefined) return <Navigate to='/login' />;
  return <Navigate to="/projects" replace />;
}

export default RootRedirect;
