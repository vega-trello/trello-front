import { Box, Tag, Text } from "@chakra-ui/react";
import type {
	Tag as _Tag,
	Task,
} from "../../../shared/api/openapi/components/schemas";
import { useTaskTags } from "../";
import { TaskEditor } from "./task-editor";

export type TaskCardProps = {
	task: Task;
};

function FoldableTag({ tag }: { tag: _Tag }) {
	return (
		<Tag.Root bg={tag.color}>
			<Tag.Label>{tag.name}</Tag.Label>
		</Tag.Root>
	);
}

export function TaskCard({ task }: TaskCardProps) {
	const { data: tags } = useTaskTags(task.id);
	const title =
		task.title === undefined || task.title.trim().length === 0
			? "​"
			: task.title;

	return (
		<TaskEditor task={task} tags={tags}>
			<Box
				width="100%"
				borderRadius="sm"
				borderColor="border.emphasized"
				borderWidth="thin"
				p="1"
				_hover={{ bg: "bg.muted", cursor: "pointer" }}
			>
				<div style={{ display: "flex", flexWrap: "wrap" }}>
					{tags?.map((tag) => (
						<FoldableTag tag={tag} key={tag.id} />
					))}
				</div>
				<Text fontSize="sm">{title}</Text>
			</Box>
		</TaskEditor>
	);
}
