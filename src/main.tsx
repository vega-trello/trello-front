import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter, createHashRouter } from "react-router";
import { App } from "./app";
import { Account, Project, Projects } from "./pages";
import { Login, Register } from "./features";
import { RequireAuth, RequireGuest } from "./middleware";
import { HeadingProvider, ThemeProvider } from "./shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createRouter =
	import.meta.env.MODE === "gh-pages" ? createHashRouter : createBrowserRouter;
const queryClient = new QueryClient();

const router = createRouter([
	{
		element: (
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<HeadingProvider>
						<App />
					</HeadingProvider>
				</ThemeProvider>
			</QueryClientProvider>
		),
		children: [
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
