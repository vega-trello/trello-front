import { Box, Button, For, Grid, Spinner } from "@chakra-ui/react";
import { TaskCard, useDeleteTask, useTasks } from "../entities/task";
import type { UUID } from "../shared/api/openapi/components/schemas";
import { ErrorAlert } from "./";
import { useCallback } from "react";
import { createAlertDialog, useTitle } from "../shared";

const deleteDialog = createAlertDialog({
	title: "Вы уверены?",
	body: (
		<>
			Это действие приведет к удалению <b>ВСЕХ</b> архивированных карточек
		</>
	),
});

export function ArchiveView({ projectUUID }: { projectUUID: UUID }) {
	const { data: allTasks, isPending, isError, error } = useTasks(projectUUID);
	const archivedTasks = allTasks?.filter((t) => t.archived_at !== undefined);

	const deleteTask = useDeleteTask();

	const deleteAll = useCallback(() => {
		archivedTasks?.forEach((task) => {
			deleteTask.mutate({ projectUUID, taskID: task.id });
		});
	}, [archivedTasks, deleteTask, projectUUID]);

	useTitle("Архив");

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Spinner size="lg" />;

	return (
		<Box display="flex" flexDirection="column" padding="2" gap="4">
			<deleteDialog.Viewport />
			<Box>
				<Button
					size="sm"
					id="delete-all"
					colorPalette="red"
					variant="surface"
					onClick={() =>
						deleteDialog.open("delete-all", { callback: deleteAll })
					}
				>
					Удалить все
				</Button>
			</Box>
			<Grid templateColumns="repeat(auto-fit, 280px)" gap="2">
				<For each={archivedTasks}>
					{(task) => <TaskCard task={task} projectUUID={projectUUID} />}
				</For>
			</Grid>
		</Box>
	);
}
