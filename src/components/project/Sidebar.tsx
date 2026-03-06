import type { PropsWithChildren } from "react";

function Sidebar({ children }: PropsWithChildren) {
  return <aside id="sidebar">{children}</aside>;
}

export default Sidebar;
