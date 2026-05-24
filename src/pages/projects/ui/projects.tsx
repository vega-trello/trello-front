import { Box, Spinner } from "@chakra-ui/react";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import type { Project } from "../../../shared/api/openapi/components/schemas";
import { AddProjectButton } from "./add-project-button";
import { useProjects, useDeleteProject } from "../../../entities/project";
import { ProjectsCards, ErrorAlert } from "../../../widgets";
import {
	createAlertDialog,
	errorMessage,
	toaster,
	useTitle,
} from "../../../shared";
import "./projects.css";

const deleteDialog = createAlertDialog({
	title: "Вы уверены?",
	body: (
		<>
			Это действие приведёт к <b>НЕВОЗВРАТНОМУ</b>{" "}
			удалению всего проекта
		</>
	),
});

export function Projects() {
	const { data: projects, isLoading, isError, error } = useProjects();
	const deleteProject = useDeleteProject();
	const navigate = useNavigate();
	useTitle("Проекты");
	const onSelect = useCallback(
		(project: Project) => {
			navigate(`/project/${project.uuid}`);
		},
		[navigate],
	);

	if (isError) return <ErrorAlert error={error} />;
	if (isLoading) return <Spinner size="lg" />;
	if (projects === undefined) return <></>;

	return (
		<div id="projects">
			<deleteDialog.Viewport />
			<Box as="main" padding="4">
				<ProjectsCards
					projects={projects}
					onSelect={onSelect}
					onEdit={() => {}}
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
				<AddProjectButton />
			</Box>
		</div>
	);
}
