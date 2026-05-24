import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter, createHashRouter } from "react-router";
import { StrictMode } from "react";
import { ThemeProvider } from "./shared";
import { App } from "./app";
import { Login, Register } from "./features/auth";
import { Projects } from "./pages/projects";
import { RootRedirect } from "./pages/root-redirect";
import { Project } from "./pages/project";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Account } from "./pages/account";
import { RequireAuth, RequireGuest } from "./middleware";

const createRouter =
	import.meta.env.MODE === "gh-pages" ? createHashRouter : createBrowserRouter;
const queryClient = new QueryClient();

const router = createRouter([
	{
		element: (
			<StrictMode>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider>
						<App />
					</ThemeProvider>
				</QueryClientProvider>
			</StrictMode>
		),
		children: [
			{ index: true, Component: RootRedirect },
			{
				element: <RequireGuest />,
				children: [
					{ path: "/login", Component: Login },
					{ path: "/register", Component: Register },
				],
			},
			{
				element: <RequireAuth />,
				children: [
					{ path: "/account", Component: Account },
					{
						path: "/projects",
						Component: Projects,
					},
					{
						path: "/project/:uuid",
						Component: Project,
					},
				],
			},
		],
	},
]);

const root = document.getElementById("root")!;
ReactDOM.createRoot(root).render(<RouterProvider router={router} />);