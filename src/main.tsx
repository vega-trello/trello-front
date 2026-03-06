import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App.tsx";
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";
import { StrictMode } from "react";
import { Provider } from "./components/ui/provider.tsx";
import Projects from "./components/Projects.tsx";
import Project from "./components/project/Project.tsx";
import Login from "./components/auth/Login.tsx";
import Register from "./components/auth/Register.tsx";
import RootRedirect from "./components/RootRedirect.tsx";
import Preferences from "./components/Preferences.tsx";
import API from "./api/api.ts";
import RequireAuth from "./middleware/requireAuth.tsx";

const router = createBrowserRouter(
  [
    {
      element: (
        <StrictMode>
          <Provider>
            <App />
          </Provider>
        </StrictMode>
      ),
      children: [
        { index: true, Component: RootRedirect },
        { path: "/login", Component: Login },
        { path: "/register", Component: Register },
        {
          element: <RequireAuth />,
          children: [
            { path: "/preferences", Component: Preferences },
            { path: "/projects", Component: Projects },
            {
              path: "/project/:uuid",
              Component: Project,
              loader: async ({ params }) => {
                return await API.GetProject(params["uuid"] as string);
              },
            },
          ],
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
