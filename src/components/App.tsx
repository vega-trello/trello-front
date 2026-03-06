import { Outlet } from "react-router";
import Header from "./Header";
import "./App.css";

function App() {
  return (
    <div id="app">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
