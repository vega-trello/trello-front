import {
	Box,
	Button,
	Checkbox,
	ColorPicker,
	DataList,
	Dialog,
	For,
	IconButton,
	Input,
	parseColor,
	Portal,
	Text,
} from "@chakra-ui/react";
import type {
	Tag,
	Assignee,
	Task,
	UUID,
	Color as TColor,
} from "../../../shared/api/openapi/components/schemas";
import { useCallback, useRef, useState, type PropsWithChildren } from "react";
import {
	HiOutlineCalendar,
	HiOutlineCheck,
	HiOutlineMenuAlt2,
	HiOutlineTag,
} from "react-icons/hi";
import { HiOutlineViewColumns } from "react-icons/hi2";
import { useAttachTag, useDetachTag, useUpdateTask } from "../";
import { toaster, errorMessage, randomHexColor } from "../../../shared";
import { useUser } from "../../user";
import { ClickableTag } from "../../tag";
import { StatusSelect } from "./status-select";
import { DatetimePicker } from "./datetime-picker";
import { AddTagPopover } from "./add-tag-popover";
import { AssigneesView } from "./assignees-view";
import { MdAdd } from "react-icons/md";
import { useAddAssignee, useRemoveAssignee } from "../../assignee";
import { ColumnSelect } from "./column-select";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEditor } from "@tiptap/react";

import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { DescriptionEditor } from "./description-editor";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";

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
	const { data: user } = useUser(task.creator_uuid);
	const [archived, setArchived] = useState(task.archived_at !== undefined);
	const updateTask = useUpdateTask();
	const attachTag = useAttachTag();
	const detachTag = useDetachTag();
	const addAssignee = useAddAssignee();
	const removeAssignee = useRemoveAssignee();
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: { levels: [1, 2, 3, 4, 5, 6] },
			}),
			Image.configure({ inline: true, allowBase64: true }),
			Subscript,
			Superscript,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Link.configure({ openOnClick: false, autolink: true }),
			TaskList,
			TaskItem.configure({ nested: true }),
			Table.configure({ resizable: true }),
			TableRow,
			TableCell,
			TableHeader,
			Placeholder.configure({ placeholder: "Описание задачи…" }),
			CharacterCount,
			Typography,
			TextStyle,
			Color,
		],
		editable: true,
		immediatelyRender: false,
	});

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
				setArchived(_task.archived_at !== null);
				editor?.commands.setContent(_task.description ?? "", {
					emitUpdate: false,
				});
			}
			setOpen(e.open);
		},
		[_task, _tags, _assignees, editor],
	);

	const update = useCallback(async () => {
		const description = editor
			? editor.isEmpty
				? null
				: editor.getHTML()
			: null;

		await updateTask.mutateAsync(
			{
				projectUUID: projectUUID!,
				taskID: task.id,
				title: textOrNull(titleRef.current?.value),
				status_id: task.status_id,
				description,
				column_id: task.column_id,
				start_date: task.start_date,
				end_date: task.end_date,
				color: task.color,
				done: task.done,
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
		editor,
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
					<Dialog.Content
						width={{ base: "95vw", md: "min(90vw, 900px)" }}
						maxWidth="900px"
					>
						<Box
							height="128px"
							bg={task.color ?? undefined}
							display="flex"
							justifyContent="space-between"
							alignItems="flex-end"
							px="6"
							py="2"
							borderColor="border.emphasized"
							borderWidth="thin"
							borderTop="none"
							borderInline="none"
						>
							{task.color === null ? (
								<Button
									variant="surface"
									onClick={() =>
										setTask((t) => ({ ...t, color: randomHexColor() }))
									}
								>
									Добавить цвет
								</Button>
							) : (
								<>
									<ColorPicker.Root
										value={parseColor(task.color)}
										onValueChange={(e) =>
											setTask((t) => ({
												...t,
												color: e.value.toString("hex") as TColor,
											}))
										}
										format="hsla"
									>
										<ColorPicker.HiddenInput />
										<ColorPicker.Control>
											<ColorPicker.Trigger />
											<ColorPicker.Input bg="bg.muted" />
										</ColorPicker.Control>
										<ColorPicker.Positioner>
											<ColorPicker.Content>
												<ColorPicker.Area />
												<ColorPicker.Sliders />
											</ColorPicker.Content>
										</ColorPicker.Positioner>
									</ColorPicker.Root>
									<Button
										variant="surface"
										onClick={() => setTask((t) => ({ ...t, color: null }))}
									>
										Удалить цвет
									</Button>
								</>
							)}
						</Box>

						<Dialog.Body>
							<Box
								display="grid"
								gridTemplateColumns={{ base: "1fr", md: "7fr 3fr" }}
								gap="6"
								css={{
									"@media (min-width: 768px)": {
										"& > :first-child": {
											borderRight: "1px solid",
											borderColor: "border.muted",
											paddingRight: "6",
										},
									},
								}}
							>
								<DataList.Root>
									{Item(
										<></>,
										<Input
											variant="flushed"
											defaultValue={
												_task.title === null ? undefined : _task.title
											}
											size="xl"
											ref={titleRef}
										/>,
									)}
									{Item("Создал", <Text>{user?.username}</Text>)}
									{Item(
										<>
											<HiOutlineMenuAlt2 /> Описание
										</>,
										<DescriptionEditor
											editor={editor}
											defaultValue={_task.description ?? undefined}
										/>,
									)}
								</DataList.Root>

								<DataList.Root>
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
										<>
											<HiOutlineViewColumns /> Колонка
										</>,
										<ColumnSelect
											projectUUID={projectUUID}
											value={task.column_id.toString()}
											setValue={(v) =>
												setTask((t) => ({
													...t,
													column_id: parseInt(v),
												}))
											}
										/>,
									)}
									{Item(
										<>
											<HiOutlineCheck />
											Статус
										</>,
										<StatusSelect
											projectUUID={projectUUID}
											value={task.status_id?.toString()}
											setValue={(v) =>
												setTask((t) => ({
													...t,
													status_id: v === undefined ? null : parseInt(v),
												}))
											}
										/>,
									)}
									{Item(
										"Участники",
										<AssigneesView
											projectUUID={projectUUID}
											value={assigneesUUIDs}
											setValue={setAssigneesUUIDs}
										/>,
									)}
									{Item(
										<>
											<HiOutlineCalendar />
											Начало
										</>,
										<DatetimePicker
											value={task.start_date ?? undefined}
											setValue={(v) =>
												setTask((t) => ({ ...t, start_date: v ?? null }))
											}
										/>,
									)}
									{Item(
										<>
											<HiOutlineCalendar />
											Дедлайн
										</>,
										<DatetimePicker
											value={task.end_date ?? undefined}
											setValue={(v) =>
												setTask((t) => ({ ...t, end_date: v ?? null }))
											}
										/>,
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
							</Box>
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
