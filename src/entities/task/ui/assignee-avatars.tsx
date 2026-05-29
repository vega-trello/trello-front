import { Box, Flex } from "@chakra-ui/react";
import type { Assignee } from "../../../shared/api/openapi/components/schemas";
import { useUser } from "../../user";
import { type PropsWithChildren } from "react";

const MAX_VISIBLE = 2;
export type AssigneeAvatarsProps = {
	assignees: Assignee[];
};

function Blob({
	z,
	title,
	children,
}: { z: number; title: string } & PropsWithChildren) {
	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="center"
			width="20px"
			height="20px"
			borderRadius="full"
			fontSize="10px"
			userSelect="none"
			title={title}
			borderWidth="thin"
			backgroundColor="bg.muted"
			borderColor="border.emphasized"
			zIndex={z}
			lineHeight={1}
			flexShrink={0}
			mr="-1"
			letterSpacing={0}
		>
			{children}
		</Box>
	);
}

function Avatar({ assignee, z }: { assignee: Assignee; z: number }) {
	const { data: user } = useUser(assignee.user_uuid);
	const firstChar = user?.username[0] ?? "?";
	return (
		<Blob z={z} title={user?.username ?? ""}>
			{firstChar}
		</Blob>
	);
}
export function AssigneeAvatars({ assignees }: AssigneeAvatarsProps) {
	if (!assignees || assignees.length === 0) return null;

	const visible = assignees.slice(0, MAX_VISIBLE);
	const overflow = assignees.length - MAX_VISIBLE;

	return (
		<Flex
			display="flex"
			alignItems="center"
			position="relative"
			gap="-1"
			isolation="isolate"
			ml="auto"
		>
			{visible.map((a, i) => (
				<Avatar key={a.user_uuid} assignee={a} z={visible.length - i} />
			))}
			{overflow > 0 && (
				<Blob z={0} title={`${overflow} more`}>
					+{overflow}
				</Blob>
			)}
		</Flex>
	);
}
