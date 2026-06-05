import { Box, Checkbox, Flex, HStack, Spinner, Text } from "@chakra-ui/react";
import type {
	Task,
	UUID,
} from "../../../shared/api/openapi/components/schemas";
import { useTaskTags, useUpdateTask } from "../";
import { TaskEditor } from "./task-editor";
import { FoldableTag } from "../../tag";
import { ErrorAlert } from "../../../widgets";
import { useStatus } from "../../status";
import { useAssignees } from "../../assignee";
import { AssigneeAvatars } from "./assignee-avatars";
import { useDraggable } from "@dnd-kit/react";
import { useCallback } from "react";
import { errorMessage, toaster } from "../../../shared";
import { TaskModifiers } from "./task-modifiers";

export type TaskCardProps = {
	task: Task;
	projectUUID: UUID;
};

export function TaskCard({ task, projectUUID }: TaskCardProps) {
	const { ref } = useDraggable({
		id: `task-${task.id}`,
		type: "card",
		data: {
			taskID: task.id,
		},
	});
	const {
		data: tags,
		isPending,
		isError,
		error,
	} = useTaskTags(projectUUID, task.id);
	const { data: status } = useStatus(projectUUID, task.status_id);
	const { data: assignees } = useAssignees(projectUUID, task.id);
	const updateTask = useUpdateTask();
	const title =
		task.title === null || task.title.trim().length === 0 ? "​" : task.title;
	const hasAssignees = assignees && assignees.length > 0;

	const handleCheck = useCallback(
		(checked: boolean) => {
			updateTask.mutate(
				{
					projectUUID,
					taskID: task.id,
					title: task.title,
					description: task.description,
					column_id: task.column_id,
					status_id: task.status_id,
					start_date: task.start_date,
					color: task.color,
					end_date: task.end_date,
					done: checked,
					archived: task.archived_at !== null,
				},
				{
					onError: (err) => toaster.error(errorMessage(err)),
				},
			);
		},
		[updateTask, projectUUID, task],
	);

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Spinner size="sm" />;

	return (
		<TaskEditor
			projectUUID={projectUUID}
			task={task}
			tags={tags ?? []}
			assignees={assignees ?? []}
		>
			<Box
				ref={ref}
				className="task-card"
				role="group"
				width="100%"
				borderRadius="sm"
				borderColor="border.emphasized"
				borderWidth="thin"
				bg='bg.panel'
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
					"& .done-check": {
						width: "0px",
						opacity: 0,
						pointerEvents: "none",
						transition: "width .2s ease, opacity .2s ease",
					},
					"&:hover .done-check, & .done-check[data-state='checked']": {
						width: "20px",
						opacity: 1,
						pointerEvents: "auto",
					},
				}}
				overflow="hidden"
				gap="0"
			>
				{task.color !== null && (
					<Box width="100%" height="24px" bg={task.color} />
				)}
				<Flex flexDirection="column" p="2" gap="1">
					{tags !== undefined && tags.length !== 0 && (
						<Box display="flex" flexWrap="wrap" gap="1">
							{tags.map((tag) => (
								<FoldableTag tag={tag} key={tag.id} />
							))}
						</Box>
					)}
					<HStack align="start" display="inline" position="relative">
						<Checkbox.Root
							className="done-check"
							colorPalette="green"
							position="relative"
							defaultChecked={task.done}
							onCheckedChange={(e) => handleCheck(!!e.checked)}
							onClick={(e) => e.stopPropagation()}
							display="inline"
							size="sm"
							float="left"
							lineHeight="1"
							pt="0.5"
							mr="0.5"
						>
							<Checkbox.HiddenInput />
							<Checkbox.Control />
						</Checkbox.Root>
						<Text fontSize="sm">{title}</Text>
					</HStack>
					{task.status_id !== null && status !== undefined && (
						<Text fontSize="xs" color="fg.muted">
							{status.name}
						</Text>
					)}

					<Box
						display="flex"
						gapX="4"
						gapY="1"
						flexWrap="wrap"
						alignItems="center"
						justifyContent="space-between"
					>
						<TaskModifiers task={task} assignees={assignees ?? []} />
						{hasAssignees && <AssigneeAvatars assignees={assignees!} />}
					</Box>
				</Flex>
			</Box>
		</TaskEditor>
	);
}
