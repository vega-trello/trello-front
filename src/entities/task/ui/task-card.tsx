import { Box, Spinner, Text } from "@chakra-ui/react";
import type {
	Task,
	UUID,
} from "../../../shared/api/openapi/components/schemas";
import { useTaskTags } from "../";
import { TaskEditor } from "./task-editor";
import { FoldableTag } from "../../tag";
import { HiOutlineClock, HiOutlineMenuAlt2 } from "react-icons/hi";
import { ErrorAlert } from "../../../widgets";
import { useStatus } from "../../status";
import { useAssignees } from "../../assignee";

export type TaskCardProps = {
	task: Task;
	projectUUID: UUID;
};

function formatShortDate(date: Date): string {
	return new Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "short",
	}).format(date);
}

export function TaskCard({ task, projectUUID }: TaskCardProps) {
	const {
		data: tags,
		isLoading,
		isError,
		error,
	} = useTaskTags(projectUUID, task.id);
	const { data: status } = useStatus(projectUUID, task.status_id ?? -1);
	const { data: assignees } = useAssignees(projectUUID, task.id);
	const title =
		task.title === undefined || task.title.trim().length === 0
			? "​"
			: task.title;

	const modifiers = {
		deadline:
			task.end_date !== undefined
				? formatShortDate(new Date(task.end_date))
				: undefined,
		description:
			task.description !== undefined && task.description.length !== 0,
	};
	const anyModifier = Object.values(modifiers).some((t) => t);

	if (isError) return <ErrorAlert error={error} />;
	if (isLoading) return <Spinner size="sm" />;

	return (
		<TaskEditor
			projectUUID={projectUUID}
			task={task}
			tags={tags ?? []}
			assignees={assignees ?? []}
		>
			<Box
				className="task-card"
				role="group"
				width="100%"
				borderRadius="sm"
				borderColor="border.emphasized"
				borderWidth="thin"
				p="2"
				_hover={{ bg: "bg.muted", cursor: "pointer" }}
				css={{
					"&:hover .foldable-tag": {
						height: "1.6rem",
						paddingLeft: "0.75rem",
						paddingRight: "0.75rem",
					},
					"&:hover .foldable-tag-text": {
						opacity: 0.75,
					},
				}}
				display="flex"
				flexDirection="column"
				gap="1"
			>
				{tags !== undefined && tags.length !== 0 && (
					<Box display="flex" flexWrap="wrap" gap="1">
						{tags.map((tag) => (
							<FoldableTag tag={tag} key={tag.id} />
						))}
					</Box>
				)}
				<Text fontSize="sm">{title}</Text>
				{task.status_id !== undefined && status !== undefined && (
					<Text fontSize="xs" color="fg.muted">
						{status.name}
					</Text>
				)}
				
				{anyModifier && (
					<Box display="flex" gap="4" flexWrap="nowrap" alignItems="center">
						{modifiers.deadline && (
							<Box
								display="flex"
								alignItems="center"
								whiteSpace="nowrap"
								gap="0.5"
							>
								<HiOutlineClock />
								<Text fontSize="sm" fontWeight="medium" lineHeight={1}>
									{modifiers.deadline}
								</Text>
							</Box>
						)}
						{modifiers.description && <HiOutlineMenuAlt2 />}
					</Box>
				)}
			</Box>
		</TaskEditor>
	);
}
