import {
	Box,
	Button,
	createOverlay,
	Dialog,
	Field,
	Flex,
	Input,
	Portal,
	Stack,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import type { Project } from "../../../shared/api/openapi/components/schemas";
import { AddProjectDialog } from "./add-project-dialog";
import {
	useProjects,
	useDeleteProject,
	useUpdateProject,
} from "../../../entities/project";
import { ProjectsCards, ErrorAlert, Loader } from "../../../widgets";
import {
	createAlertDialog,
	errorMessage,
	toaster,
	useTitle,
} from "../../../shared";

const deleteDialog = createAlertDialog({
	title: "Вы уверены?",
	body: (
		<Flex flexDirection="column">
			<span>Если вы создатель проекта:</span>
			<span>
				Это действие приведёт к <b>НЕВОЗВРАТНОМУ</b> удалению всего проекта
			</span>
			<span>Если вы НЕ создатель: {"\n\t"}</span>
			<span>Вы выйдите из проекта</span>
		</Flex>
	),
});

const editProjectDialog = createOverlay<{ project: Project }>(
	({ project, ...props }) => {
		const [data, setData] = useState({
			title: project.title,
			description: project.description ?? "",
		});
		const updateProject = useUpdateProject();
		const handleUpdate = useCallback(() => {
			updateProject.mutate(
				{
					projectUUID: project.uuid,
					title: data.title,
					description:
						data.description.trim().length === 0 ? null : data.description,
				},
				{
					onError: (err) => toaster.error(errorMessage(err)),
				},
			);
		}, [updateProject, project.uuid, data]);

		return (
			<Dialog.Root {...props}>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Изменить проект</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Stack gap="4">
								<Field.Root>
									<Field.Label>Название</Field.Label>
									<Input
										placeholder="Название"
										value={data.title}
										onChange={(e) =>
											setData((d) => ({
												...d,
												title: e.target.value,
											}))
										}
									/>
								</Field.Root>
								<Field.Root>
									<Field.Label>Описание</Field.Label>
									<Input
										placeholder="Описание"
										value={data.description}
										onChange={(e) =>
											setData((d) => ({
												...d,
												description: e.target.value,
											}))
										}
									/>
								</Field.Root>
							</Stack>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button
									onClick={handleUpdate}
									loading={updateProject.isPending}
								>
									Сохранить
								</Button>
							</Dialog.ActionTrigger>
						</Dialog.Footer>
					</Dialog.Content>
				</Portal>
			</Dialog.Root>
		);
	},
);

export function Projects() {
	const { data: projects, isPending, isError, error } = useProjects();
	const deleteProject = useDeleteProject();
	const navigate = useNavigate();
	useTitle("Проекты");

	const onSelect = useCallback(
		(project: Project) => {
			navigate(`/project/${project.uuid}`);
		},
		[navigate],
	);
	const onEdit = useCallback(
		(project: Project) =>
			editProjectDialog.open("project-edit", {
				project,
			}),
		[],
	);

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Loader size="lg" />;

	return (
		<Box width='100%' height='100%'>
			<deleteDialog.Viewport />
			<editProjectDialog.Viewport />

			<Box as="main" padding="4" width='100%' height='100%'>
				<ProjectsCards
					projects={projects}
					onSelect={onSelect}
					onEdit={onEdit}
					onDelete={({ uuid }) =>
						deleteDialog.open("delete-project", {
							callback: () => {
								deleteProject.mutate(
									{ projectUUID: uuid },
									{
										onError: (err) => toaster.error(errorMessage(err)),
									},
								);
							},
						})
					}
				/>
				<AddProjectDialog>
					<Button variant="solid" position='absolute' bottom='4' right='4'>Добавить</Button>
				</AddProjectDialog>
			</Box>
		</Box>
	);
}
