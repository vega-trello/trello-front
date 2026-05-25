import { Button, Text } from "@chakra-ui/react";
import type { Tag } from "../../../shared/api/openapi/components/schemas";

export type ClickableTagProps = {
	tag: Tag;
	callback: () => void;
};

export function ClickableTag({ tag, callback }: ClickableTagProps) {
	return (
		<Button
			onClick={callback}
			color="innvert"
			bg={tag.color}
			size="md"
			rounded="full"
			paddingY="2"
			paddingX="3"
			lineHeight={1}
			height="auto"
			_hover={{ cursor: "pointer" }}
		>
			<Text mixBlendMode="difference" color="white">
				{tag.name}
			</Text>
		</Button>
	);
}
