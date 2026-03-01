import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App.tsx";
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";
import { StrictMode } from "react";
import { Provider } from "./components/ui/provider.tsx";
import Library from "./components/Library.tsx";
import Project from "./components/project/Project.tsx";
import Login from "./components/auth/Login.tsx";
import Register from "./components/auth/Register.tsx";
import RootRedirect from "./components/RootRedirect.tsx";
import Preferences from "./components/Preferences.tsx";

const router = createBrowserRouter([
  {
    element: (
      <StrictMode>
        <Provider>
          <App />
        </Provider>
      </StrictMode>
    ),
    children: [
      {
        index: true,
        Component: RootRedirect,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/preferences",
        Component: Preferences,
      },
      {
        path: "/projects",
        Component: Library,
      },
      {
        path: "/project/:uuid",
        loader: async () => {
          return { res: await fetch("https://httpbin.org/delay/5") };
        },
        Component: Project,
      },
    ],
  },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
