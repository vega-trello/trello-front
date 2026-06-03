import { Outlet } from "react-router";
import { Header } from "../../widgets";
import { ToasterRoot } from "../../shared";
import './app.css'

export function App() {
	return (
		<div id="app">
			<Header />
			<Outlet />
			<ToasterRoot />
		</div>
	);
}
