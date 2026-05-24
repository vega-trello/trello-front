import { For, Table, Text } from "@chakra-ui/react";
import type { Project } from "../../shared/api/openapi/components/schemas";

export type ProjectsTableProps = {
	projects: Project[];
	onSelect: (project: Project) => unknown;
};

export function ProjectsTable({ projects, onSelect }: ProjectsTableProps) {
	return (
		<Table.Root size="lg">
			<Table.Header>
				<Table.Row>
					<Table.ColumnHeader>Название</Table.ColumnHeader>
					<Table.ColumnHeader>Создан</Table.ColumnHeader>
					<Table.ColumnHeader>Последнее обновление</Table.ColumnHeader>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<For each={projects}>
					{(project) => {
						const creationDate = new Date(project.created_at);
						const updateDate = new Date(project.updated_at);
						return (
							<Table.Row
								className="row"
								onClick={() => onSelect(project)}
								onKeyDown={(e) => e.code === "Enter" && onSelect(project)}
								key={project.uuid}
								tabIndex={0}
							>
								<Table.Cell>
									<Text alignItems="center" display="flex" gap="2">
										{project.title}
									</Text>
								</Table.Cell>
								<Table.Cell>{creationDate.toLocaleString()}</Table.Cell>
								<Table.Cell>{updateDate.toLocaleString()}</Table.Cell>
							</Table.Row>
						);
					}}
				</For>
			</Table.Body>
		</Table.Root>
	);
}
