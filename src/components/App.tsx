import { Outlet } from "react-router";
import Header from "./Header";
import "./App.css";
import { useColorMode } from "./ui/color-mode";
import { useEffect } from "react";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code !== "KeyT") return;
      toggleColorMode();
    };
    document.addEventListener("keypress", listener);
    return () => {
      document.removeEventListener("keypress", listener);
    };
  }, [toggleColorMode]);

  useEffect(() => {
    console.log(colorMode);
  }, [colorMode]);
  return (
    <div id="app">
      <Header userUUID="532b224c-111a-4026-a7e5-0368277a2ae6" />
      <Outlet />
    </div>
  );
}

export default App;
