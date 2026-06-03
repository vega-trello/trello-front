import { NavLink } from "react-router";
import "./Header.css";
import { Box, Heading } from "@chakra-ui/react";
import { ThemeSwitcher } from "../../features";
import { useHeading } from "../../shared";
import { User } from "../user";

export function Header() {
	const heading = useHeading();

	return (
		<Box as="header" id="main-header" bg="Background" shadow="xs">
			<div className="inner">
				<div className="left">
					<NavLink to="/" end style={{ color: "inherit" }}>
						<Heading id="title">Vrello</Heading>
					</NavLink>
				</div>
				{heading}
				<div className="right">
					<User />
					<ThemeSwitcher />
				</div>
			</div>
		</Box>
	);
}
