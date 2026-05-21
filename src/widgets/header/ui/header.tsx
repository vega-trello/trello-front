import { NavLink } from "react-router";
import "./Header.css";
import { Box, Heading } from "@chakra-ui/react";
import { User } from "./user";
import { ThemeSwitcher } from "../../../features/theme-switcher";

export function Header() {
	return (
		<Box as="header" id="main-header" bg="Background" shadow="xs">
			<div className="inner">
				<div className="left">
					<NavLink to="/" end style={{ color: "inherit" }}>
						<Heading id="title">Trega</Heading>
					</NavLink>
				</div>
				<div className="right">
					<User />
					<ThemeSwitcher />
				</div>
			</div>
		</Box>
	);
}
