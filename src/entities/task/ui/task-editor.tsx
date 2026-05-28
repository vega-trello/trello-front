import {
	Box,
	Button,
	Checkbox,
	DataList,
	Dialog,
	For,
	IconButton,
	Input,
	Portal,
	Text,
	Textarea,
} from "@chakra-ui/react";
import type {
	Tag,
	Assignee,
	Task,
	UUID,
} from "../../../shared/api/openapi/components/schemas";
import { useCallback, useRef, useState, type PropsWithChildren } from "react";
import { HiOutlineMenuAlt2, HiOutlineTag } from "react-icons/hi";
import { useAttachTag, useDetachTag, useUpdateTask } from "../";
import { toaster, errorMessage } from "../../../shared";
import { useUser } from "../../user";
import { ClickableTag } from "../../tag";
import { StatusSelect } from "./status-select";
import { DatetimePicker } from "./datetime-picker";
import { AddTagPopover } from "./add-tag-popover";
import { AssigneesView } from "./assignees-view";
import { MdAdd } from "react-icons/md";
import { useAddAssignee, useRemoveAssignee } from "../../assignee";

function Item(label: React.ReactNode, value: React.ReactNode) {
	return (
		<DataList.Item>
			<DataList.ItemLabel>{label}</DataList.ItemLabel>
			<DataList.ItemValue>{value}</DataList.ItemValue>
		</DataList.Item>
	);
}

function textOrNull(s: string | undefined) {
	return s === undefined || s.trim().length === 0 ? null : s.trim();
}

export type TaskEditorProps = {
	task: Task;
	tags: Tag[];
	projectUUID: UUID;
	assignees: Assignee[];
} & PropsWithChildren;

export function TaskEditor({
	task: _task,
	tags: _tags,
	assignees: _assignees,
	projectUUID,
	children,
}: TaskEditorProps) {
	const [open, setOpen] = useState(false);
	const [tags, setTags] = useState<Tag[]>(_tags);
	const [task, setTask] = useState<Task>(_task);
	const [assigneesUUIDs, setAssigneesUUIDs] = useState<UUID[]>(
		_assignees.map((a) => a.user_uuid),
	);
	const titleRef = useRef<HTMLInputElement | null>(null);
	const descRef = useRef<HTMLTextAreaElement | null>(null);
	const { data: user } = useUser(task.creator_uuid);
	const [archived, setArchived] = useState(task.archived_at !== undefined);
	const updateTask = useUpdateTask();
	const attachTag = useAttachTag();
	const detachTag = useDetachTag();
	const addAssignee = useAddAssignee();
	const removeAssignee = useRemoveAssignee();

	const pending =
		updateTask.isPending ||
		attachTag.isPending ||
		detachTag.isPending ||
		addAssignee.isPending ||
		removeAssignee.isPending;

	const handleOpenChange = useCallback(
		(e: { open: boolean }) => {
			if (e.open) {
				setTask(_task);
				setTags(_tags);
				setAssigneesUUIDs(_assignees.map((a) => a.user_uuid));
				setArchived(_task.archived_at !== undefined);
			}
			setOpen(e.open);
		},
		[_task, _tags, _assignees],
	);

	const update = useCallback(async () => {
		await updateTask.mutateAsync(
			{
				projectUUID: projectUUID!,
				taskID: task.id,
				title: textOrNull(titleRef.current?.value),
				status_id: task.status_id ?? null,
				description: textOrNull(descRef.current?.value),
				column_id: task.column_id,
				start_date: task.start_date ?? null,
				end_date: task.end_date ?? null,
				archived,
			},
			{
				onSuccess: () => setOpen(false),
				onError: (err) => {
					toaster.error(errorMessage(err));
				},
			},
		);

		{
			const tagIDs = new Set(tags.map((t) => t.id));
			const initialTagIDs = new Set(_tags?.map((t) => t.id) ?? []);
			const toAdd = [...tagIDs].filter((id) => !initialTagIDs.has(id));
			const toDelete = [...initialTagIDs].filter((id) => !tagIDs.has(id));
			await Promise.all(
				toAdd.map((tagID) =>
					attachTag.mutateAsync(
						{ projectUUID, taskID: task.id, tagID },
						{
							onError: (err) => {
								toaster.error(errorMessage(err));
							},
						},
					),
				),
			);
			await Promise.all(
				toDelete.map((tagID) =>
					detachTag.mutateAsync(
						{ projectUUID, taskID: task.id, tagID },
						{
							onError: (err) => {
								toaster.error(errorMessage(err));
							},
						},
					),
				),
			);
		}
		{
			const initialUUIDs = new Set(_assignees?.map((a) => a.user_uuid));
			const currentUUIDs = new Set(assigneesUUIDs);
			const toAdd = assigneesUUIDs.filter((u) => !initialUUIDs.has(u));
			const toRemove = [...initialUUIDs].filter((u) => !currentUUIDs.has(u));
			await Promise.all(
				toAdd.map((uuid) =>
					addAssignee.mutateAsync(
						{
							projectUUID,
							taskID: task.id,
							user_uuid: uuid,
						},
						{
							onError: (err) => toaster.error(errorMessage(err)),
						},
					),
				),
			);
			await Promise.all(
				toRemove.map((uuid) =>
					removeAssignee.mutateAsync(
						{
							projectUUID,
							taskID: task.id,
							userUUID: uuid,
						},
						{
							onError: (err) => toaster.error(errorMessage(err)),
						},
					),
				),
			);
		}
	}, [
		updateTask,
		task,
		archived,
		projectUUID,
		tags,
		attachTag,
		detachTag,
		_tags,
		_assignees,
		assigneesUUIDs,
		addAssignee,
		removeAssignee,
	]);

	return (
		<Dialog.Root
			key={_task.id}
			motionPreset="slide-in-bottom"
			open={open}
			onOpenChange={handleOpenChange}
		>
			<Dialog.Trigger display="contents" as="div">
				{children}
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Body>
							<DataList.Root>
								{Item(
									<></>,
									<Input
										variant="flushed"
										defaultValue={_task.title}
										size="xl"
										ref={titleRef}
									/>,
								)}
								{Item(
									<>
										<HiOutlineTag /> Тэги
									</>,
									<Box display="flex" gap="2" flexWrap="wrap">
										<For each={tags}>
											{(tag) => (
												<ClickableTag
													key={tag.id}
													tag={tag}
													callback={() =>
														setTags((t) => t.filter((t) => t.id !== tag.id))
													}
												/>
											)}
										</For>
										<AddTagPopover
											projectUUID={projectUUID}
											tags={tags}
											setTags={setTags}
										>
											<IconButton variant="outline" size="sm">
												<MdAdd />
											</IconButton>
										</AddTagPopover>
									</Box>,
								)}
								{Item(
									"Статус",
									<StatusSelect
										projectUUID={projectUUID}
										value={task.status_id?.toString()}
										setValue={(v) =>
											setTask((t) => {
												return {
													...t,
													status_id: v === undefined ? undefined : parseInt(v),
												};
											})
										}
									/>,
								)}
								{Item("Создал", <Text>{user?.username}</Text>)}
								{Item(
									"Участники",
									<AssigneesView
										projectUUID={projectUUID}
										value={assigneesUUIDs}
										setValue={setAssigneesUUIDs}
									/>,
								)}
								{Item(
									"Начало",
									<DatetimePicker
										value={task.start_date}
										setValue={(v) => setTask((t) => ({ ...t, start_date: v }))}
									/>,
								)}
								{Item(
									"Срок",
									<DatetimePicker
										value={task.end_date}
										setValue={(v) => setTask((t) => ({ ...t, end_date: v }))}
									/>,
								)}
								{Item(
									<>
										<HiOutlineMenuAlt2 /> Описание
									</>,
									<Textarea defaultValue={_task.description} ref={descRef} />,
								)}
								{Item(
									<></>,
									<Checkbox.Root
										size="sm"
										checked={archived}
										onCheckedChange={(e) => setArchived(!!e.checked)}
									>
										<Checkbox.HiddenInput />
										<Checkbox.Control />
										<Checkbox.Label>Архивирована</Checkbox.Label>
									</Checkbox.Root>,
								)}
							</DataList.Root>
						</Dialog.Body>
						<Dialog.Footer>
							<Button loading={pending} onClick={update}>
								Сохранить
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}
