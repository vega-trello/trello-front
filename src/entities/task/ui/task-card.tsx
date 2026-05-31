import { Box, Spinner, Text } from "@chakra-ui/react";
import type {
	Task,
	UUID,
} from "../../../shared/api/openapi/components/schemas";
import { useTaskTags } from "../";
import { TaskEditor } from "./task-editor";
import { FoldableTag } from "../../tag";
import {
	HiOutlineClock,
	HiOutlineEye,
	HiOutlineMenuAlt2,
} from "react-icons/hi";
import { ErrorAlert } from "../../../widgets";
import { useStatus } from "../../status";
import { useAssignees } from "../../assignee";
import { AssigneeAvatars } from "./assignee-avatars";
import { useSelf } from "../../user";

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
	const { data: user } = useSelf();
	const {
		data: tags,
		isPending,
		isError,
		error,
	} = useTaskTags(projectUUID, task.id);
	const { data: status } = useStatus(projectUUID, task.status_id ?? -1);
	const { data: assignees } = useAssignees(projectUUID, task.id);
	const title =
		task.title === null || task.title.trim().length === 0 ? "​" : task.title;

	const modifiers = {
		subscribed: assignees?.some((a) => a.user_uuid === user?.uuid),
		deadline:
			task.end_date !== null
				? formatShortDate(new Date(task.end_date))
				: undefined,
		description: task.description !== null && task.description.length !== 0,
	};
	const anyModifier = Object.values(modifiers).some((t) => t);
	const hasAssignees = assignees && assignees.length > 0;

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Spinner size="sm" />;

	const deadlineColor =
		task.end_date !== null
			? new Date(task.end_date).getTime() < new Date().getTime()
				? "red"
				: undefined
			: undefined;

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
				{task.status_id !== null && status !== undefined && (
					<Text fontSize="xs" color="fg.muted">
						{status.name}
					</Text>
				)}

				{(anyModifier || hasAssignees) && (
					<Box
						display="flex"
						gapX="4"
						gapY="1"
						flexWrap="wrap"
						alignItems="center"
						justifyContent="space-between"
					>
						<Box display="flex" gap="2" alignItems="center" flexWrap="nowrap">
							{modifiers.subscribed && <HiOutlineEye />}
							{modifiers.deadline && (
								<Box
									display="flex"
									alignItems="center"
									whiteSpace="nowrap"
									gap="0.5"
								>
									<HiOutlineClock color={deadlineColor} />
									<Text
										fontSize="sm"
										fontWeight="medium"
										lineHeight={1}
										color={deadlineColor}
									>
										{task.start_date && (
											<>{formatShortDate(new Date(task.start_date))} — </>
										)}
										{modifiers.deadline}
									</Text>
								</Box>
							)}
							{modifiers.description && <HiOutlineMenuAlt2 />}
						</Box>
						{hasAssignees && <AssigneeAvatars assignees={assignees!} />}
					</Box>
				)}
			</Box>
		</TaskEditor>
	);
}
