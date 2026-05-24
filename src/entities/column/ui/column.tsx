import {
	Box,
	Button,
	createOverlay,
	Dialog,
	Field,
	For,
	Group,
	Heading,
	IconButton,
	Input,
	Menu,
	MenuTrigger,
	Portal,
	Spinner,
	Stack,
	VStack,
} from "@chakra-ui/react";
import type {
	Column,
	UUID,
} from "../../../shared/api/openapi/components/schemas";
import { HiArrowLeft, HiArrowRight, HiDotsHorizontal } from "react-icons/hi";
import { useTasks } from "../../task";
import {
	useDeleteColumn,
	useMoveColumn,
	useUpdateColumn,
} from "../model/use-column-mutation";
import { useColumn } from "../model/use-column";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import { ErrorAlert } from "../../../widgets/error-alert/ui/error-alert";
import { useCallback, useRef, useState } from "react";
import { toaster } from "../../../shared";
import { errorMessage } from "../../../shared/model/error-message";

export type ColumnProps = {
	projectUUID: UUID;
	columnID: integer;
};

const openRenameDialog = createOverlay<{ column: Column }>(
	({ column, open, onOpenChange }) => {
		const ref = useRef<HTMLInputElement | null>(null);
		const [name, setName] = useState(column.name);
		const updateColumn = useUpdateColumn();

		const handleClose = useCallback(
			() => onOpenChange?.({ open: false }),
			[onOpenChange],
		);

		const submit = useCallback(() => {
			updateColumn.mutate(
				{
					columnID: column.id,
					name,
				},
				{ onSuccess: handleClose },
			);
		}, [updateColumn, name, column, handleClose]);

		return (
			<Dialog.Root
				open={open}
				onOpenChange={(e) => !e.open && handleClose()}
				initialFocusEl={() => ref.current}
				motionPreset="slide-in-bottom"
				placement="center"
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Новая колонка</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Stack gap="4">
									<Field.Root>
										<Field.Label>Название</Field.Label>
										<Input
											placeholder="Новое название"
											ref={ref}
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
									</Field.Root>
								</Stack>
							</Dialog.Body>
							<Dialog.Footer>
								<Dialog.ActionTrigger asChild>
									<Button variant="ghost">Отменить</Button>
								</Dialog.ActionTrigger>
								<Dialog.ActionTrigger asChild>
									<Button variant="solid" type="submit" onClick={submit}>
										Переименовать
									</Button>
								</Dialog.ActionTrigger>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		);
	},
);

function ColumnMenu({
	projectUUID,
	column,
}: {
	projectUUID: UUID;
	column: Column;
}) {
	const deleteColumn = useDeleteColumn(projectUUID);
	const moveColumn = useMoveColumn();
	const [open, setOpen] = useState(false);
	const move = useCallback(
		(direction: "right" | "left") => {
			setOpen(false);
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

	return (
		<Menu.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
			<MenuTrigger asChild>
				<IconButton
					aria-label="Действия"
					variant="ghost"
					size="sm"
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
								onClick={() => move("left")}
							>
								<HiArrowLeft />
							</Menu.Item>
							<Menu.Item
								value="right"
								width="50%"
								display="flex"
								justifyContent="flex-end"
								onClick={() => move("right")}
							>
								<HiArrowRight />
							</Menu.Item>
						</Group>
						<Menu.Item
							value="edit"
							onClick={() => openRenameDialog.open("edit", { column })}
						>
							Переименовать
						</Menu.Item>
						<Menu.Item
							value="delete"
							color="fg.error"
							_hover={{ bg: "bg.error", color: "fg.error" }}
							onClick={_delete}
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
	const { data: column, isLoading, isError, error } = useColumn(columnID);
	const { data: allTasks } = useTasks(projectUUID);
	const tasks = allTasks?.filter(
		(task) => task.column_id === (column?.id ?? -1),
	);

	if (isError) return <ErrorAlert error={error} />;
	if (isLoading) return <Spinner />;
	if (column === undefined) return <>Watafaq</>;

	return (
		<Box
			bg="bg.subtle"
			borderRadius="lg"
			p={4}
			w="280px"
			minH="100px"
			display="flex"
			flexDirection="column"
			flexShrink={0}
		>
			<openRenameDialog.Viewport />
			<Heading
				size="sm"
				mb={3}
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

			<VStack gap={2} overflowY="auto" flex={1} pr={1} scrollbarWidth="thin">
				{tasks !== undefined ? (
					<For each={tasks}>{(task) => <span>{task.title}</span>}</For>
				) : (
					<Spinner />
				)}
			</VStack>
		</Box>
	);
}
