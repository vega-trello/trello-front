import { For, Heading, Table, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { NavLink, useLoaderData } from "react-router";
import type { Project } from "../../../shared/api/openapi/components/schemas";
import { AddProjectButton } from "./add-button";
import "./page.css";

export function Projects() {
  const projects: Project[] | null = useLoaderData();
  useEffect(() => {
    document.title = "Trello | Проекты";
  });

  if (projects === null) return <Text>Error loading projects</Text>;
  return (
    <div id="projects">
      <Heading size="2xl" margin="4">
        Проекты
      </Heading>
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
            {(project) => (
              <NavLink
                to={"/project/" + project.uuid}
                style={{ display: "contents" }}
                key={project.uuid}
              >
                <Table.Row className="row">
                  <Table.Cell>
                    <Text alignItems="center" display="flex" gap="2">
                      {project.title}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>01.01.2001</Table.Cell>
                  <Table.Cell>10.10.2010</Table.Cell>
                </Table.Row>
              </NavLink>
            )}
          </For>
        </Table.Body>
      </Table.Root>
      <AddProjectButton />
    </div>
  );
}
