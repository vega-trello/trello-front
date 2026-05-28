import { useState, type PropsWithChildren } from "react";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { Box, For, Input, Popover, Portal } from "@chakra-ui/react";
import { useMembers } from "../../member/model/use-member";
import { AssigneeBubble } from "../../assignee";

type AddAssigneePopoverProps = {
	projectUUID: UUID;
	value: UUID[];
	setValue: (u: (old: UUID[]) => UUID[]) => void;
} & PropsWithChildren;

export function AddAssigneePopover({
	projectUUID,
	value,
	setValue,
	children,
}: AddAssigneePopoverProps) {
	const uuids = new Set(value);
	const { data: members } = useMembers(projectUUID);
	const membersToAdd = members?.filter((m) => !uuids.has(m.uuid));
	const [search, setSearch] = useState("");

	return (
		<Popover.Root size="sm">
			<Popover.Trigger asChild>{children}</Popover.Trigger>
			<Portal>
				<Popover.Positioner>
					<Popover.Content>
						<Popover.Arrow />
						<Popover.Body>
							<Input
								placeholder="Найти участников"
								size="sm"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								mb="2"
							/>
							<Box display="flex" gap="1" flexWrap="wrap">
								<For
									each={membersToAdd?.filter((m) =>
										m.username.toLowerCase().includes(search.toLowerCase()),
									)}
								>
									{(m) => (
										<AssigneeBubble
											key={m.uuid}
											uuid={m.uuid}
											onClick={() => setValue((l) => [...l, m.uuid])}
										/>
									)}
								</For>
							</Box>
						</Popover.Body>
					</Popover.Content>
				</Popover.Positioner>
			</Portal>
		</Popover.Root>
	);
}
