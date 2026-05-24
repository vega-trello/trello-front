import {
	Box,
	Button,
	Checkbox,
	DataList,
	Dialog,
	For,
	Input,
	Portal,
	Tag,
	Text,
	Textarea,
} from "@chakra-ui/react";
import type {
	Tag as _Tag,
	Task,
} from "../../../shared/api/openapi/components/schemas";
import {
	useCallback,
	useState,
	type PropsWithChildren,
} from "react";
import { HiOutlineMenuAlt2, HiOutlineTag } from "react-icons/hi";
import { useUpdateTask } from "../";
import { useParams } from "react-router";
import { toaster, errorMessage } from "../../../shared";
import { useUser } from "../../user";
import { useTags } from "../../tag";

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

export function TaskEditor({
	task: _task,
	tags: _tags,
	children,
}: { task: Task; tags: _Tag[] | undefined } & PropsWithChildren) {
	const [open, setOpen] = useState(false);
	const [tags] = useState<_Tag[]>(_tags || []);
	const tagIds = new Set(tags?.map((t) => t.id) ?? []);
	const { uuid: projectUUID } = useParams<{ uuid: string }>();
	const [task, setTask] = useState<Task>(_task);
	const { data: user } = useUser(task.creator_uuid);
	const [archived, setArchived] = useState(task.archived_at !== undefined);
	const updateTask = useUpdateTask();
	const { data: allTags } = useTags(projectUUID!);
	const tagsToAdd = allTags?.filter((t) => !tagIds.has(t.id));
	console.log(tagsToAdd);

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
	}, [updateTask, task, archived, projectUUID]);

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
												<Tag.Root bg={tag.color}>
													<Tag.Label>{tag.name}</Tag.Label>
												</Tag.Root>
											)}
										</For>
										<Button variant="outline" size="sm">
											+
										</Button>
									</Box>,
								)}
								{Item("Создал", <Text>{user?.username}</Text>)}
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
							<Button loading={updateTask.isPending} onClick={update}>
								Сохранить
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}
