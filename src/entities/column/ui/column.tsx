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
	Text,
	VStack,
} from "@chakra-ui/react";
import type {
	Color,
	Column,
	UUID,
} from "../../../shared/api/openapi/components/schemas";
import { HiArrowLeft, HiArrowRight, HiDotsHorizontal } from "react-icons/hi";
import { TaskCard, useTasks } from "../../task";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import { ErrorAlert } from "../../../widgets";
import { useCallback } from "react";
import { errorMessage, randomHexColor, toaster } from "../../../shared";
import { AddTaskButton } from "./add-task-button";
import {
	colorDialog,
	useColumn,
	useDeleteColumn,
	useMoveColumn,
	useUpdateColumn,
} from "../";
import { renameDialog } from "./rename-dialog";
import { deleteDialog } from "./delete-dialog";
import { useDroppable } from "@dnd-kit/react";

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
	const updateColumn = useUpdateColumn();
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
		renameDialog.open(`column-edit-${column.id}`, { column });
	}, [column]);

	const handleDelete = useCallback(() => {
		deleteDialog.open(`column-delete-${column.id}`, { callback: _delete });
	}, [column, _delete]);

	const handleAddColor = useCallback(() => {
		updateColumn.mutate(
			{
				columnID: column.id,
				name: column.name,
				color: (randomHexColor() + "C0") as Color,
			},
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [updateColumn, column]);
	const handleChangeColor = useCallback(() => {
		colorDialog.open(`column-color-${column.id}`, { column });
	}, [column]);
	const handleDeleteColor = useCallback(() => {
		updateColumn.mutate(
			{
				columnID: column.id,
				name: column.name,
				color: null,
			},
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [updateColumn, column]);

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
						<Menu.Separator />
						<Menu.Item value="edit" onClick={handleRename}>
							Переименовать
						</Menu.Item>
						{column.color === null ? (
							<Menu.Item value="add-color" onClick={handleAddColor}>
								Добавить цвет
							</Menu.Item>
						) : (
							<>
								<Menu.Item value="change-color" onClick={handleChangeColor}>
									Изменить цвет
								</Menu.Item>
								<Menu.Item value="delete-color" onClick={handleDeleteColor}>
									Удалить цвет
								</Menu.Item>
							</>
						)}
						<Menu.Separator />
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
	const { ref, isDropTarget } = useDroppable({
		id: `column-${columnID}`,
		accept: "card",
		data: {
			columnID,
		},
	});
	const { data: column, isPending, isError, error } = useColumn(columnID);
	const { data: allTasks } = useTasks(projectUUID);
	const tasks = allTasks?.filter(
		(task) => task.archived_at === null && task.column_id === column?.id,
	);

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Spinner />;

	return (
		<Box
			ref={ref}
			bg={column.color ?? "bg.subtle"}
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
			position="relative"
		>
			<Box
				pointerEvents="none"
				userSelect="none"
				position="absolute"
				inset="0"
				bg="rgba(128 128 128 / .9)"
				opacity="0"
				style={isDropTarget ? { opacity: "1" } : {}}
				transition="opacity .1s ease"
				display="flex"
				justifyContent="center"
				alignItems="center"
			>
				<Text>Переместить сюда</Text>
			</Box>
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
