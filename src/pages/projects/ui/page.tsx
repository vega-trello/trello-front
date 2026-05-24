import { Heading, Spinner } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Project } from "../../../shared/api/openapi/components/schemas";
import { AddProjectButton } from "./add-project-button";
import { useProjects } from "../../../entities/project";
import "./page.css";
import { ProjectsCards } from "../../../widgets/projects/ui/cards";
import { useDeleteProject } from "../../../entities/project/model/use-project-mutation";
import { ErrorAlert } from "../../../widgets/error-alert/ui/error-alert";

export function Projects() {
	const { data: projects, isLoading, isError, error } = useProjects();
	const deleteProject = useDeleteProject();
	const navigate = useNavigate();
	useEffect(() => {
		document.title = "Trega | Проекты";
	});

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
			<Heading size="2xl" margin="4">
				Проекты
			</Heading>
			<main>
				<ProjectsCards
					projects={projects}
					onSelect={onSelect}
					onEdit={() => {}}
					onDelete={({ uuid }) => deleteProject.mutate({ projectUUID: uuid })}
				/>
				<AddProjectButton />
			</main>
		</div>
	);
}
