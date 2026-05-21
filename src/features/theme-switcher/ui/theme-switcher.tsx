import { Icon, Switch } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useColorMode } from "../model/user-color-mode";

export function ThemeSwitcher() {
	const { colorMode, setColorMode } = useColorMode();

	return (
		<Switch.Root
			colorPalette="blue"
			checked={colorMode === "dark"}
			onCheckedChange={({ checked }) =>
				setColorMode(checked ? "dark" : "light")
			}
			flexGrow={1}
		>
			<Switch.HiddenInput />
			<Switch.Control>
				<Switch.Thumb />
				<Switch.Indicator fallback={<Icon as={FaSun} />}>
					<Icon as={FaMoon} />
				</Switch.Indicator>
			</Switch.Control>
		</Switch.Root>
	);
}
