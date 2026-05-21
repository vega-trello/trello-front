import { useColorMode } from "./user-color-mode";

export function useColorModeValue<T>(light: T, dark: T) {
	const { colorMode } = useColorMode();
	return colorMode === "dark" ? dark : light;
}
