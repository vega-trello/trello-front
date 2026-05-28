import { useState, type PropsWithChildren } from "react";
import type { Tag, UUID } from "../../../shared/api/openapi/components/schemas";
import { ClickableTag, useTags } from "../../tag";
import { Box, For, Input, Popover, Portal } from "@chakra-ui/react";

type AddTagPopoverProps = {
	projectUUID: UUID;
	tags: Tag[];
	setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
};

export function AddTagPopover({
	projectUUID,
	tags,
	setTags,
	children,
}: AddTagPopoverProps & PropsWithChildren) {
	const tagIds = new Set(tags.map((t) => t.id));
	const { data: allTags } = useTags(projectUUID);
	const tagsToAdd = allTags?.filter((t) => !tagIds.has(t.id));
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
								placeholder="Найти тэг"
								size="sm"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								mb="2"
							/>
							<Box display="flex" gap="1" flexWrap="wrap">
								<For
									each={tagsToAdd?.filter((t) =>
										t.name.toLowerCase().includes(search.toLowerCase()),
									)}
								>
									{(tag) => (
										<ClickableTag
											key={tag.id}
											tag={tag}
											callback={() => setTags((t) => [...t, tag])}
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