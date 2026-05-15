import { Outlet } from "react-router";
import "./App.css";
import { Header } from "../../widgets/header";

export function App() {
  return (
    <div id="app">
      <Header />
      <Outlet />
    </div>
  );
}