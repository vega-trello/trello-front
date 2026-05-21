import type { PropsWithChildren } from "react";
import "./sidebar.css";

export function Sidebar({ children }: PropsWithChildren) {
	return <aside id="sidebar">{children}</aside>;
}
