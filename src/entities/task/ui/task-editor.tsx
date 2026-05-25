import {
	Box,
	Button,
	Checkbox,
	DataList,
	DatePicker,
	Dialog,
	For,
	Input,
	parseDate,
	Popover,
	Portal,
	Text,
	Textarea,
} from "@chakra-ui/react";
import type {
	Tag as _Tag,
	Task,
	UUID,
} from "../../../shared/api/openapi/components/schemas";
import { useCallback, useState, type PropsWithChildren } from "react";
import { HiOutlineMenuAlt2, HiOutlineTag } from "react-icons/hi";
import { useAttachTag, useDetachTag, useUpdateTask } from "../";
import { toaster, errorMessage } from "../../../shared";
import { useUser } from "../../user";
import { ClickableTag, useTags } from "../../tag";
import { LuCalendar } from "react-icons/lu";

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

type AddTagPopoverProps = {
	projectUUID: UUID;
	tags: _Tag[];
	setTags: React.Dispatch<React.SetStateAction<_Tag[]>>;
};

function AddTagPopover({
	projectUUID,
	tags,
	setTags,
	children,
}: AddTagPopoverProps & PropsWithChildren) {
	const tagIds = new Set(tags.map((t) => t.id));
	const { data: allTags } = useTags(projectUUID);
	const tagsToAdd = allTags?.filter((t) => !tagIds.has(t.id));
	const [search, setSearch] = useState("");

	return (
		<Popover.Root size="sm">
			<Popover.Trigger asChild>{children}</Popover.Trigger>
			<Portal>
				<Popover.Positioner>
					<Popover.Content>
						<Popover.Arrow />
						<Popover.Body>
							<Input
								placeholder="Найти тэг"
								size="sm"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								mb="2"
							/>
							<Box display="flex" gap="1" flexWrap="wrap">
								<For
									each={tagsToAdd?.filter((t) =>
										t.name.toLowerCase().includes(search.toLowerCase()),
									)}
								>
									{(tag) => (
										<ClickableTag
											key={tag.id}
											tag={tag}
											callback={() => setTags((t) => [...t, tag])}
										/>
									)}
								</For>
							</Box>
						</Popover.Body>
					</Popover.Content>
				</Popover.Positioner>
			</Portal>
		</Popover.Root>
	);
}

function DatetimePicker({
	value,
	setValue,
}: {
	value: string | undefined;
	setValue: (v: string | undefined) => void;
}) {
	const parsed = value ? [parseDate(value.split("T")[0])] : [];

	return (
		<DatePicker.Root
			locale="ru-RU"
			value={parsed}
			onValueChange={(e) => {
				if (e.value.length === 0) {
					setValue(undefined);
				} else {
					setValue(
						e.value[0]
							.toDate("UTC")
							.toISOString()
							.replace(/\.\d{3}Z$/, "Z"),
					);
				}
			}}
		>
			<DatePicker.Control>
				<DatePicker.Input />
				<DatePicker.IndicatorGroup>
					<DatePicker.Context>
						{(context) =>
							context.value.length > 0 ? (
								<DatePicker.ClearTrigger />
							) : (
								<DatePicker.Trigger>
									<LuCalendar />
								</DatePicker.Trigger>
							)
						}
					</DatePicker.Context>
				</DatePicker.IndicatorGroup>
			</DatePicker.Control>
			<Portal>
				<DatePicker.Positioner>
					<DatePicker.Content>
						<DatePicker.View view="day">
							<DatePicker.Header />
							<DatePicker.DayTable />
						</DatePicker.View>
						<DatePicker.View view="month">
							<DatePicker.Header />
							<DatePicker.MonthTable />
						</DatePicker.View>
						<DatePicker.View view="year">
							<DatePicker.Header />
							<DatePicker.YearTable />
						</DatePicker.View>
					</DatePicker.Content>
				</DatePicker.Positioner>
			</Portal>
		</DatePicker.Root>
	);
}

export function TaskEditor({
	task: _task,
	tags: _tags,
	projectUUID,
	children,
}: {
	task: Task;
	tags: _Tag[];
	projectUUID: UUID;
} & PropsWithChildren) {
	const [open, setOpen] = useState(false);
	const [tags, setTags] = useState<_Tag[]>(_tags);
	const [task, setTask] = useState<Task>(_task);
	const { data: user } = useUser(task.creator_uuid);
	const [archived, setArchived] = useState(task.archived_at !== undefined);
	const updateTask = useUpdateTask();
	const attachTag = useAttachTag();
	const detachTag = useDetachTag();

	const pending =
		updateTask.isPending || attachTag.isPending || detachTag.isPending;

	const handleOpenChange = useCallback(
		(e: { open: boolean }) => {
			if (e.open) {
				setTask(_task);
				setArchived(_task.archived_at !== undefined);
			}
			setOpen(e.open);
		},
		[_task],
	);

	const update = useCallback(() => {
		updateTask.mutate(
			{
				projectUUID: projectUUID!,
				taskID: task.id,
				title: textOrNull(task.title),
				description: textOrNull(task.description),
				column_id: task.column_id,
				start_date: task.start_date ?? null,
				end_date: task.end_date ?? null,
				archived,
			},
			{
				onSuccess: () => setOpen(false),
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
		const tagIDs = new Set(tags.map((t) => t.id));
		const initialTagIDs = new Set(_tags?.map((t) => t.id) ?? []);
		const toAdd = [...tagIDs].filter((id) => !initialTagIDs.has(id));
		const toDelete = [...initialTagIDs].filter((id) => !tagIDs.has(id));
		toAdd.forEach((tagID) =>
			attachTag.mutate(
				{ taskID: task.id, tagID },
				{ onError: (err) => toaster.error(errorMessage(err)) },
			),
		);
		toDelete.forEach((tagID) =>
			detachTag.mutate(
				{ taskID: task.id, tagID },
				{ onError: (err) => toaster.error(errorMessage(err)) },
			),
		);
	}, [
		updateTask,
		task,
		archived,
		projectUUID,
		tags,
		attachTag,
		detachTag,
		_tags,
	]);

	return (
		<Dialog.Root
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
										value={task.title}
										size="xl"
										onChange={(e) =>
											setTask((data) => ({
												...data,
												title: e.target.value,
											}))
										}
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
											<Button variant="outline" size="sm">
												+
											</Button>
										</AddTagPopover>
									</Box>,
								)}
								{Item("Создал", <Text>{user?.username}</Text>)}
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
									<Textarea
										value={task.description}
										onChange={(e) =>
											setTask((data) => ({
												...data,
												description:
													e.target.value.trim() === ""
														? undefined
														: e.target.value,
											}))
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
