import { Button, Spinner } from "@chakra-ui/react";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { useUser } from "../../user";

export type AssigneeBubbleProps = {
	uuid: UUID;
	onClick: (uuid: UUID) => void;
};

export function AssigneeBubble({ uuid, onClick }: AssigneeBubbleProps) {
	const { data: user } = useUser(uuid);

	return (
		<Button
			onClick={() => onClick(uuid)}
			variant="outline"
			size="md"
			rounded="full"
			paddingY="2"
			paddingX="3"
			lineHeight={1}
			height="auto"
			_hover={{ cursor: "pointer" }}
		>
			{user === undefined ? <Spinner size="xs" /> : user.username}
		</Button>
	);
}
