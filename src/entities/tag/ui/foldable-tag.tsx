import { Box, Text } from "@chakra-ui/react";
import type { Tag } from "../../../shared/api/openapi/components/schemas";

export type FoldableTagProps = {
	tag: Tag;
};

export function FoldableTag({ tag }: FoldableTagProps) {
	return (
		<Box
			className="foldable-tag"
			bg={tag.color}
			rounded="full"
			height="4px"
			paddingX="0"
			display="flex"
			alignItems="center"
			overflow="hidden"
			transition="height 0.2s ease, padding 0.2s ease"
			cursor="pointer"
			minW="2rem"
		>
			<Text
				className="foldable-tag-text"
				mixBlendMode="difference"
				color="white"
				fontSize="sm"
				whiteSpace="nowrap"
				opacity={0}
				transition="opacity 0.1s ease 0.15s"
			>
				{tag.name}
			</Text>
		</Box>
	);
}
