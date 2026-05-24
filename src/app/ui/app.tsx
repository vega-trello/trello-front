import { Outlet } from "react-router";
import "./App.css";
import { Header } from "../../widgets";
import { ToasterRoot } from "../../shared";

export function App() {
	return (
		<div id="app">
			<Header />
			<Outlet />
			<ToasterRoot />
		</div>
	);
}
