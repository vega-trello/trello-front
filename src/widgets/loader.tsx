import { Flex, Spinner } from "@chakra-ui/react";

export function Loader({
	size,
}: {
	size?: "inherit" | "xs" | "sm" | "md" | "lg" | "xl" | undefined;
}) {
	return (
		<Flex width="100%" height="100%" justify="center" align="center">
			<Spinner size={size} />
		</Flex>
	);
}
