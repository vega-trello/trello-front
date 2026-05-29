import {
	Box,
	For,
	Group,
	Heading,
	IconButton,
	Menu,
	MenuTrigger,
	Portal,
	Spinner,
	VStack,
} from "@chakra-ui/react";
import type {
	Column,
	UUID,
} from "../../../shared/api/openapi/components/schemas";
import { HiArrowLeft, HiArrowRight, HiDotsHorizontal } from "react-icons/hi";
import { TaskCard, useTasks } from "../../task";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import { ErrorAlert } from "../../../widgets";
import { useCallback } from "react";
import { errorMessage, toaster } from "../../../shared";
import { AddTaskButton } from "./add-task-button";
import { useColumn, useDeleteColumn, useMoveColumn } from "../";
import { renameDialog } from "./rename-dialog";
import { deleteDialog } from "./delete-dialog";

export type ColumnProps = {
	projectUUID: UUID;
	columnID: integer;
};

function ColumnMenu({
	projectUUID,
	column,
}: {
	projectUUID: UUID;
	column: Column;
}) {
	const deleteColumn = useDeleteColumn(projectUUID);
	const moveColumn = useMoveColumn();
	const move = useCallback(
		(direction: "right" | "left") => {
			moveColumn.mutate(
				{
					columnID: column.id,
					direction,
				},
				{
					onError: (error) => toaster.error(errorMessage(error)),
				},
			);
		},
		[moveColumn, column],
	);
	const _delete = useCallback(() => {
		deleteColumn.mutate(
			{ columnID: column.id },
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [deleteColumn, column]);

	const handleMoveLeft = useCallback(() => move("left"), [move]);
	const handleMoveRight = useCallback(() => move("right"), [move]);

	const handleRename = useCallback(() => {
		renameDialog.open("edit", { column });
	}, [column]);

	const handleDelete = useCallback(() => {
		deleteDialog.open(`column-${column.id}`, { callback: _delete });
	}, [column, _delete]);

	return (
		<Menu.Root>
			<MenuTrigger asChild>
				<IconButton
					aria-label="Действия"
					variant="ghost"
					size="2xs"
					onClick={(e) => e.stopPropagation()}
				>
					<HiDotsHorizontal />
				</IconButton>
			</MenuTrigger>
			<Portal>
				<Menu.Positioner>
					<Menu.Content>
						<Group grow gap="0">
							<Menu.Item
								value="left"
								width="50%"
								display="flex"
								justifyContent="flex-start"
								onClick={handleMoveLeft}
							>
								<HiArrowLeft />
							</Menu.Item>
							<Menu.Item
								value="right"
								width="50%"
								display="flex"
								justifyContent="flex-end"
								onClick={handleMoveRight}
							>
								<HiArrowRight />
							</Menu.Item>
						</Group>
						<Menu.Item value="edit" onClick={handleRename}>
							Переименовать
						</Menu.Item>
						<Menu.Item
							value="delete"
							color="fg.error"
							_hover={{ bg: "bg.error", color: "fg.error" }}
							onClick={handleDelete}
						>
							Удалить
						</Menu.Item>
					</Menu.Content>
				</Menu.Positioner>
			</Portal>
		</Menu.Root>
	);
}

export function Column({ projectUUID, columnID }: ColumnProps) {
	const { data: column, isPending, isError, error } = useColumn(columnID);
	const { data: allTasks } = useTasks(projectUUID);
	const tasks = allTasks?.filter(
		(task) =>
			task.archived_at === undefined && task.column_id === (column?.id ?? -1),
	);

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Spinner />;

	return (
		<Box
			bg="bg.subtle"
			borderRadius="lg"
			p="2"
			width="100%"
			maxHeight="100%"
			overflow="hidden"
			display="flex"
			flexDirection="column"
			flexShrink={0}
			id={`column-${column.id}`}
			gap="4"
		>
			<Heading
				size="sm"
				px={1}
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				{column.name}

				<ColumnMenu {...{ projectUUID, column }} />
			</Heading>

			{tasks !== undefined && tasks.length !== 0 && (
				<VStack
					gap={2}
					overflowY="auto"
					overflowX="visible"
					flex={1}
					pr={1}
					scrollbarWidth="thin"
				>
					{tasks !== undefined ? (
						<For each={tasks}>
							{(task) => (
								<TaskCard key={task.id} task={task} projectUUID={projectUUID} />
							)}
						</For>
					) : (
						<Spinner />
					)}
				</VStack>
			)}

			<AddTaskButton columnID={columnID} projectUUID={projectUUID} />
		</Box>
	);
}
