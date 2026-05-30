import { Flex, Link, Text } from "@chakra-ui/react";
import { TaskCard, useDeleteTask, useUpdateTask } from "../../entities/task";
import type { Task, UUID } from "../../shared/api/openapi/components/schemas";
import { useCallback } from "react";
import { errorMessage, toaster } from "../../shared";

export type ArchiveTaskCardProps = {
	projectUUID: UUID;
	task: Task;
};
export function ArchiveTaskCard({ task, projectUUID }: ArchiveTaskCardProps) {
	const deleteTask = useDeleteTask();
	const updateTask = useUpdateTask();

	const handleRestore = useCallback(() => {
		updateTask.mutate(
			{
				projectUUID,
				taskID: task.id,
				title: task.title ?? null,
				description: task.description ?? null,
				start_date: task.start_date ?? null,
				end_date: task.end_date ?? null,
				status_id: task.status_id ?? null,
				column_id: task.column_id,
				archived: false,
			},
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [updateTask, projectUUID, task]);
	const handleDelete = useCallback(() => {
		deleteTask.mutate(
			{
				projectUUID,
				taskID: task.id,
			},
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [deleteTask, projectUUID, task]);

	return (
		<Flex flexDir="column" gap={0}>
			<TaskCard task={task} projectUUID={projectUUID} />
			<Flex justify="flex-end" align="center">
				<Link fontSize="xs" onClick={handleRestore}>
					Восстановить
				</Link>
				<Text lineHeight={1} fontSize="xs">
					⋅
				</Text>
				<Link fontSize="xs" colorPalette="red" onClick={handleDelete}>
					Удалить
				</Link>
			</Flex>
		</Flex>
	);
}
