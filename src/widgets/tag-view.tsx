import {
	Box,
	Button,
	ColorPicker,
	Dialog,
	Flex,
	HStack,
	IconButton,
	Input,
	parseColor,
	Portal,
	Text,
} from "@chakra-ui/react";
import { For } from "@chakra-ui/react";
import type {
	Color,
	Tag,
	UUID,
} from "../shared/api/openapi/components/schemas";
import {
	useCreateTag,
	useDeleteTag,
	useTags,
	useUpdateTag,
} from "../entities/tag";
import { ErrorAlert } from "./error-alert";
import {
	createAlertDialog,
	errorMessage,
	toaster,
	useTitle,
	randomHexColor,
} from "../shared";
import { Loader } from "./loader";
import { useCallback, useRef, useState, type PropsWithChildren } from "react";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

const deleteDialog = createAlertDialog({
	title: "Вы уверены?",
	body: "Удаление тэга приведёт к его отсоединению от всех карточек",
});

type TagProps = {
	projectUUID: UUID;
	tag: Tag;
};

function TagEdit({
	projectUUID,
	tag: _tag,
	children,
}: TagProps & PropsWithChildren) {
	const ref = useRef<HTMLInputElement | null>(null);
	const [tag, setTag] = useState(_tag);
	const updateTag = useUpdateTag();

	const handleUpdate = useCallback(() => {
		updateTag.mutate(
			{ projectUUID, tagID: tag.id, ...tag },
			{ onError: (err) => toaster.error(errorMessage(err)) },
		);
	}, [projectUUID, tag, updateTag]);

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
							<Dialog.Title>Редактирование тэга</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<HStack>
								<ColorPicker.Root
									value={parseColor(tag.color)}
									onValueChange={(e) =>
										setTag((t) => ({
											...t,
											color: e.value.toString("hex") as Color,
										}))
									}
									format="hsla"
								>
									<ColorPicker.HiddenInput />
									<ColorPicker.Control>
										<ColorPicker.Trigger />
										<ColorPicker.Input />
									</ColorPicker.Control>
									<ColorPicker.Positioner>
										<ColorPicker.Content>
											<ColorPicker.Area />
											<ColorPicker.Sliders />
										</ColorPicker.Content>
									</ColorPicker.Positioner>
								</ColorPicker.Root>
								<Input
									value={tag.name}
									onChange={(e) =>
										setTag((t) => ({ ...t, name: e.target.value }))
									}
								/>
							</HStack>
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
									loading={updateTag.isPending}
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

function Tag({ projectUUID, tag }: TagProps) {
	const deleteTag = useDeleteTag();

	const handleDelete = useCallback(() => {
		deleteTag.mutate(
			{ projectUUID, tagID: tag.id },
			{ onError: (err) => toaster.error(errorMessage(err)) },
		);
	}, [deleteTag, projectUUID, tag]);

	return (
		<Box display="flex" alignItems="center" justifyContent="space-between">
			<Box display="flex" alignItems="center" gap="4">
				<ColorPicker.Root value={parseColor(tag.color)} format="hsla" readOnly>
					<ColorPicker.HiddenInput />
					<ColorPicker.Control>
						<ColorPicker.Trigger />
					</ColorPicker.Control>
				</ColorPicker.Root>
				<Text>{tag.name}</Text>
			</Box>
			<Box>
				<TagEdit projectUUID={projectUUID} tag={tag}>
					<IconButton variant="ghost">
						<HiOutlinePencilAlt />
					</IconButton>
				</TagEdit>
				<IconButton
					loading={deleteTag.isPending}
					variant="ghost"
					colorPalette="red"
					onClick={() =>
						deleteDialog.open("delete-tag", { callback: handleDelete })
					}
				>
					<HiOutlineTrash />
				</IconButton>
			</Box>
		</Box>
	);
}

export function TagView({ projectUUID }: { projectUUID: UUID }) {
	const { data: tags, isPending, isError, error } = useTags(projectUUID);
	const createTag = useCreateTag();
	useTitle("Тэги");

	const handleCreate = useCallback(() => {
		createTag.mutate(
			{
				projectUUID,
				name: "Новый тэг",
				color: randomHexColor(),
			},
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [createTag, projectUUID]);

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Loader size="xl" />;

	return (
		<Box display="flex" justifyContent="center" padding="8">
			<deleteDialog.Viewport />
			<Box w="100%" maxW="640px" display="flex" flexDirection="column" gap="6">
				<Flex justify="space-between" align="center">
					<Box>
						<Text fontWeight="semibold" fontSize="lg">
							Тэги
						</Text>
						<Text fontSize="sm" color="gray.500">
							Тэгов в проекте: {tags.length}
						</Text>
					</Box>
					<Button size="sm" onClick={handleCreate}>
						+ Добавить тэг
					</Button>
				</Flex>

				<Box display="flex" flexDirection="column" gap="2">
					<For each={tags}>
						{(tag) => <Tag key={tag.id} tag={tag} projectUUID={projectUUID} />}
					</For>
				</Box>

				{tags.length === 0 && (
					<Box textAlign="center" py="12" color="gray.400">
						<Text fontSize="sm">Тэгов пока нет. Добавьте первый!</Text>
					</Box>
				)}
			</Box>
		</Box>
	);
}
