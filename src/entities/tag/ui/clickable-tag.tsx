import { Button, Text } from "@chakra-ui/react";
import type { Tag } from "../../../shared/api/openapi/components/schemas";
import { useMemo } from "react";
import { getTextColor } from "../../../shared/model/get-text-color";

export type ClickableTagProps = {
	tag: Tag;
	callback: () => void;
};

export function ClickableTag({ tag, callback }: ClickableTagProps) {
	const color = useMemo(() => {
		return getTextColor(tag.color);
	}, [tag.color]);

	return (
		<Button
			onClick={callback}
			bg={tag.color}
			size="md"
			rounded="full"
			paddingY="2"
			paddingX="3"
			lineHeight={1}
			height="auto"
			_hover={{ cursor: "pointer" }}
		>
			<Text color={color} opacity={0.75}>
				{tag.name}
			</Text>
		</Button>
	);
}
