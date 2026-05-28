import { Box, For, IconButton } from "@chakra-ui/react";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { useCallback } from "react";
import { MdAdd } from "react-icons/md";
import { AddAssigneePopover } from "./add-assignee-popover";
import { AssigneeBubble } from "../../assignee";

export type AssigneesViewProps = {
	value: UUID[];
	setValue: (updater: (old: UUID[]) => UUID[]) => void;
	projectUUID: UUID;
};

export function AssigneesView({
	value,
	setValue,
	projectUUID,
}: AssigneesViewProps) {
	const handleDetach = useCallback(
		(uuid: UUID) => setValue((l) => l.filter((u) => u !== uuid)),
		[setValue],
	);

	return (
		<Box display="flex" gap="2" flexWrap="wrap">
			<For each={value}>
				{(u) => <AssigneeBubble key={u} uuid={u} onClick={handleDetach} />}
			</For>
			<AddAssigneePopover
				projectUUID={projectUUID}
				value={value}
				setValue={setValue}
			>
				<IconButton variant="outline" size="sm">
					<MdAdd />
				</IconButton>
			</AddAssigneePopover>
		</Box>
	);
}
