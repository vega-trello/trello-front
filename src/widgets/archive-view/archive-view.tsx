import { Box, Button, Flex, For, Spinner, Text } from "@chakra-ui/react";
import { useDeleteTask, useTasks, useUpdateTask } from "../../entities/task";
import type { UUID } from "../../shared/api/openapi/components/schemas";
import { ErrorAlert } from "..";
import { useCallback, useMemo } from "react";
import {
	createAlertDialog,
	errorMessage,
	toaster,
	useTitle,
} from "../../shared";
import { ArchiveTaskCard } from "./archive-task-card";

const deleteDialog = createAlertDialog({
	title: "Вы уверены?",
	body: (
		<>
			Это действие приведет к удалению <b>ВСЕХ</b> архивных карточек
		</>
	),
});

const restoreDialog = createAlertDialog({
	title: "Вы уверены?",
	body: (
		<>
			Это действие приведет к восстановлению <b>ВСЕХ</b> архивных карточек
		</>
	),
	btnText: "Восстановить",
	color: "blue",
});

export function ArchiveView({ projectUUID }: { projectUUID: UUID }) {
	const { data: allTasks, isPending, isError, error } = useTasks(projectUUID);
	const archivedTasks = useMemo(
		() => allTasks?.filter((t) => t.archived_at !== null) ?? [],
		[allTasks],
	);
	const deleteTask = useDeleteTask();
	const updateTask = useUpdateTask();

	const handleDeleteAll = useCallback(async () => {
		await Promise.all(
			archivedTasks?.map((task) =>
				deleteTask.mutateAsync(
					{ projectUUID, taskID: task.id },
					{
						onError: (err) => toaster.error(errorMessage(err)),
					},
				),
			),
		);
	}, [archivedTasks, deleteTask, projectUUID]);

	const handleRestoreAll = useCallback(async () => {
		await Promise.all(
			archivedTasks.map((task) =>
				updateTask.mutateAsync(
					{
						projectUUID,
						taskID: task.id,
						title: task.title ?? null,
						description: task.description ?? null,
						start_date: task.start_date ?? null,
						end_date: task.end_date ?? null,
						column_id: task.column_id,
						status_id: task.status_id ?? null,
						archived: false,
					},
					{
						onError: (err) => toaster.error(errorMessage(err)),
					},
				),
			),
		);
	}, [archivedTasks, updateTask, projectUUID]);

	useTitle("Архив");

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Spinner size="lg" />;

	return (
		<Box display="flex" justifyContent="center" padding="8">
			<deleteDialog.Viewport />
			<restoreDialog.Viewport />
			<Box w="100%" maxW="640px" display="flex" flexDirection="column" gap="6">
				<Flex justify="space-between" align="center">
					<Box>
						<Text fontWeight="semibold" fontSize="lg">
							Архив
						</Text>
						<Text fontSize="sm" color="gray.500">
							Карточек в архиве: {archivedTasks.length}
						</Text>
					</Box>
					<Flex gap={2}>
						<Button
							size="sm"
							colorPalette="red"
							variant="surface"
							onClick={() =>
								deleteDialog.open("delete-tasks", {
									callback: handleDeleteAll,
									isPending: deleteTask.isPending,
								})
							}
						>
							Удалить все
						</Button>
						<Button
							size="sm"
							variant="surface"
							onClick={() =>
								restoreDialog.open("restore-tasks", {
									callback: handleRestoreAll,
									isPending: updateTask.isPending,
								})
							}
						>
							Восстановить все
						</Button>
					</Flex>
				</Flex>

				<Box display="flex" flexDirection="column" gap="2">
					<For each={archivedTasks}>
						{(task) => (
							<ArchiveTaskCard
								key={task.id}
								task={task}
								projectUUID={projectUUID}
							/>
						)}
					</For>
				</Box>

				{archivedTasks.length === 0 && (
					<Box textAlign="center" py="12" color="gray.400">
						<Text fontSize="sm">Архивных карточек нету</Text>
					</Box>
				)}
			</Box>
		</Box>
	);
}
