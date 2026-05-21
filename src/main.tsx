import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter, createHashRouter, redirect } from "react-router";
import { StrictMode } from "react";
import Preferences from "./components/Preferences.tsx";
import RequireAuth from "./middleware/requireAuth.tsx";
import { API, ThemeProvider } from "./shared";
import { App } from "./app";
import type { UUID } from "./shared/api/openapi/components/schemas/uuid.ts";
import { Login, Register } from "./features/auth";
import { Projects } from "./pages/projects";
import { RootRedirect } from "./pages/root-redirect";
import { Project } from "./pages/project";
import { UserProvider } from "./entities/user";

const createRouter =
	import.meta.env.MODE === "gh-pages" ? createHashRouter : createBrowserRouter;

const router = createRouter([
	{
		element: (
			<StrictMode>
				<UserProvider>
					<ThemeProvider>
						<App />
					</ThemeProvider>
				</UserProvider>
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
							const res = await API.Project.GetAll({});
							if (res.status === 200) return res.body;
							console.log("projects", { res });
							redirect("/login");
						},
						Component: Projects,
					},
					{
						path: "/project/:uuid",
						Component: Project,
						loader: async ({ params }) => {
							const uuid = params["uuid"] as UUID;
							const res = await API.Project.Get({
								projectUUID: uuid,
							});
							if (res.status === 200) return res.body;
							redirect("/projects");
						},
					},
				],
			},
		],
	},
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
