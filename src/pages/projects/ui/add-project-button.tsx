import { useCallback, useRef, useState } from "react";
import { toaster } from "../../../shared";
import {
	Button,
	Dialog,
	Field,
	Input,
	Portal,
	Stack,
	Stat,
	Textarea,
} from "@chakra-ui/react";
import { useCreateProject } from "../../../entities/project";
import type { CreateProject } from "../../../shared/api/openapi/components/schemas";
import { errorMessage } from "../../../shared";

export function AddProjectButton() {
	const ref = useRef<HTMLInputElement | null>(null);
	const [title, setTitle] = useState("");
	const titleSyms = Array.from(title).length.toString();
	const [desc, setDesc] = useState("");
	const descSyms = Array.from(desc).length.toString();

	const createProject = useCreateProject();

	const create = useCallback(async () => {
		const data: CreateProject = { title };
		if (desc !== "") data.description = desc;

		createProject.mutate(data, {
			onSuccess() {
				setTitle("");
				setDesc("");
			},
			onError(err) {
				toaster.error(errorMessage(err));
			},
		});
	}, [title, desc, createProject]);

	return (
		<Dialog.Root
			initialFocusEl={() => ref.current}
			motionPreset="slide-in-bottom"
			placement="center"
		>
			<Dialog.Trigger display="contents" as="div">
				<Button id="add-project" variant="solid">
					Добавить
				</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Новый проект</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Stack gap="4">
								<Field.Root>
									<Field.Label>Название</Field.Label>
									<Input
										placeholder="Название"
										ref={ref}
										value={title}
										onChange={(e) => setTitle(e.target.value)}
									/>
									<Stat.Root>
										<Stat.Label>{titleSyms} / 128</Stat.Label>
									</Stat.Root>
								</Field.Root>
								<Field.Root>
									<Field.Label>Описание</Field.Label>
									<Textarea
										placeholder="Описание"
										value={desc}
										onChange={(e) => setDesc(e.target.value)}
									/>
									<Stat.Root>
										<Stat.Label>{descSyms} / 128</Stat.Label>
									</Stat.Root>
								</Field.Root>
							</Stack>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="ghost">Отменить</Button>
							</Dialog.ActionTrigger>
							<Dialog.ActionTrigger asChild>
								<Button
									variant="solid"
									type="submit"
									onClick={create}
									loading={createProject.isPending}
								>
									Создать
								</Button>
							</Dialog.ActionTrigger>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}
