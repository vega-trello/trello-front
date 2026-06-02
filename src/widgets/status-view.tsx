import {
	Box,
	Button,
	Dialog,
	Flex,
	IconButton,
	Input,
	Portal,
	Text,
} from "@chakra-ui/react";
import { For } from "@chakra-ui/react";
import type { Status, UUID } from "../shared/api/openapi/components/schemas";
import { ErrorAlert } from "./error-alert";
import { createAlertDialog, errorMessage, toaster, useTitle } from "../shared";
import { Loader } from "./loader";
import { useCallback, useRef, useState, type PropsWithChildren } from "react";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import {
	useCreateStatus,
	useDeleteStatus,
	useStatuses,
	useUpdateStatus,
} from "../entities/status";

const deleteDialog = createAlertDialog({
	title: "Вы уверены?",
	body: "Удалить статус можно только если ни одна карточка не соответствует этому статусу",
});

type StatusProps = {
	projectUUID: UUID;
	status: Status;
};

function StatusEdit({
	projectUUID,
	status: _status,
	children,
}: StatusProps & PropsWithChildren) {
	const ref = useRef<HTMLInputElement | null>(null);
	const [status, setStatus] = useState(_status);
	const updateStatus = useUpdateStatus();

	const handleUpdate = useCallback(() => {
		updateStatus.mutate(
			{ projectUUID, statusID: status.id, ...status },
			{ onError: (err) => toaster.error(errorMessage(err)) },
		);
	}, [projectUUID, status, updateStatus]);

	return (
		<Dialog.Root
			initialFocusEl={() => ref.current}
			motionPreset="slide-in-bottom"
			placement="center"
		>
			<Dialog.Trigger display="contents" as="div">
				{children}
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Редактирование статуса</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Input
								value={status.name}
								onChange={(e) =>
									setStatus((s) => ({ ...s, name: e.target.value }))
								}
							/>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="ghost">Отменить</Button>
							</Dialog.ActionTrigger>
							<Dialog.ActionTrigger asChild>
								<Button
									variant="solid"
									type="submit"
									onClick={handleUpdate}
									loading={updateStatus.isPending}
								>
									Сохранить
								</Button>
							</Dialog.ActionTrigger>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

function Status({ projectUUID, status }: StatusProps) {
	const deleteStatus = useDeleteStatus();

	const handleDelete = useCallback(() => {
		deleteStatus.mutate(
			{ projectUUID, statusID: status.id },
			{ onError: (err) => toaster.error(errorMessage(err)) },
		);
	}, [deleteStatus, projectUUID, status]);

	return (
		<Box display="flex" alignItems="center" justifyContent="space-between">
			<Text>{status.name}</Text>
			<Box>
				<StatusEdit projectUUID={projectUUID} status={status}>
					<IconButton variant="ghost">
						<HiOutlinePencilAlt />
					</IconButton>
				</StatusEdit>
				<IconButton
					loading={deleteStatus.isPending}
					variant="ghost"
					colorPalette="red"
					onClick={() =>
						deleteDialog.open("delete-status", { callback: handleDelete })
					}
				>
					<HiOutlineTrash />
				</IconButton>
			</Box>
		</Box>
	);
}

export function StatusView({ projectUUID }: { projectUUID: UUID }) {
	const { data: status, isPending, isError, error } = useStatuses(projectUUID);
	const createStatus = useCreateStatus();
	useTitle("Статусы");

	const handleCreate = useCallback(() => {
		createStatus.mutate(
			{
				projectUUID,
				name: "Новый статус",
			},
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [createStatus, projectUUID]);

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Loader size="xl" />;

	return (
		<Box display="flex" justifyContent="center" padding="8">
			<deleteDialog.Viewport />
			<Box w="100%" maxW="640px" display="flex" flexDirection="column" gap="6">
				<Flex justify="space-between" align="center">
					<Box>
						<Text fontWeight="semibold" fontSize="lg">
							Статусы
						</Text>
						<Text fontSize="sm" color="gray.500">
							Статусов в проекте: {status.length}
						</Text>
					</Box>
					<Button
						size="sm"
						onClick={handleCreate}
						loading={createStatus.isPending}
					>
						+ Добавить статус
					</Button>
				</Flex>

				<Box display="flex" flexDirection="column" gap="2">
					<For each={status}>
						{(status) => {
							console.log(status);
							return (
								<Status
									key={status.id}
									status={status}
									projectUUID={projectUUID}
								/>
							);
						}}
					</For>
				</Box>

				{status.length === 0 && (
					<Box textAlign="center" py="12" color="gray.400">
						<Text fontSize="sm">Статусов пока нет. Добавьте первый!</Text>
					</Box>
				)}
			</Box>
		</Box>
	);
}
