import { Navigate } from "react-router";

function RootRedirect() {
  return <Navigate to="/projects" replace />;
}

export default RootRedirect;
