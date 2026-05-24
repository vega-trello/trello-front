import type { PropsWithChildren } from "react";
import { Box } from "@chakra-ui/react";

export function Sidebar({ children }: PropsWithChildren) {
	return (
		<Box as="aside" bg="bg.muted" width="256px" flexShrink={0}>
			{children}
		</Box>
	);
}
