"use client";

import {
	ChakraProvider as _ChakraProvider,
	defaultSystem,
} from "@chakra-ui/react";
import {
	ColorModeProvider,
	type ColorModeProviderProps,
} from "../../features/theme-switcher/model/color-mode";

export function ThemeProvider(props: ColorModeProviderProps) {
	return (
		<_ChakraProvider value={defaultSystem}>
			<ColorModeProvider {...props} />
		</_ChakraProvider>
	);
}
