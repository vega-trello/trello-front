import { Heading, Text } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import type { Project } from "../../../shared/api/openapi/components/schemas";
import { AddProjectButton } from "./add-button";
import "./page.css";
import { ProjectsTable } from "../../../widgets/projects";

export function Projects() {
	const projects: Project[] | null = useLoaderData();
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

	if (projects === null) return <Text>Error loading projects</Text>;
	return (
		<div id="projects">
			<Heading size="2xl" margin="4">
				Проекты
			</Heading>
			<ProjectsTable projects={projects} onSelect={onSelect} />
			<AddProjectButton />
		</div>
	);
}
