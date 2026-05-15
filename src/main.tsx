import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter, createHashRouter } from "react-router";
import { StrictMode } from "react";
import Preferences from "./components/Preferences.tsx";
import RequireAuth from "./middleware/requireAuth.tsx";
import { API, Provider } from "./shared/index.ts";
import { App } from "./app/index.ts";
import type { UUID } from "./shared/api/openapi/components/schemas/uuid.ts";
import { Login, Register } from "./features/auth/index.ts";
import { Projects } from "./pages/projects/index.ts";
import { RootRedirect } from "./pages/root-redirect/index.ts";
import { Project } from "./pages/project/index.ts";

const createRouter =
  import.meta.env.MODE === "gh-pages" ? createHashRouter : createBrowserRouter;

const router = createRouter([
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
          {
            path: "/projects",
            loader: async () => {
              return await API.Project.GetAll({});
            },
            Component: Projects,
          },
          {
            path: "/project/:uuid",
            Component: Project,
            loader: async ({ params }) => {
              const uuid = params["uuid"] as UUID;
              return await API.Project.Get({
                projectUUID: uuid,
              });
            },
          },
        ],
      },
    ],
  },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
