import { Spinner } from "@chakra-ui/react";

export function Loader({
	size,
}: {
	size?: "inherit" | "xs" | "sm" | "md" | "lg" | "xl" | undefined;
}) {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Spinner size={size} />
		</div>
	);
}
