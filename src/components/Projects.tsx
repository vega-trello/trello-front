import {
  Button,
  Dialog,
  Field,
  For,
  Heading,
  Input,
  Portal,
  Stack,
  Stat,
  Table,
  Text,
  Textarea,
} from "@chakra-ui/react";
import "./Projects.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useLoaderData } from "react-router";
import API from "../api/api";

function AddProjectButton() {
  const ref = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const titleSyms = Array.from(title).length.toString();
  const [desc, setDesc] = useState("");
  const descSyms = Array.from(desc).length.toString();

  const create = useCallback(() => {
    API.CreateProject({
      title,
      description: desc,
    }).then((res) => {
      alert(`Created project, ${JSON.stringify(res)}`);
    });
  }, [title, desc]);

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
              <Dialog.ActionTrigger asChild formAction={create}>
                <Button variant="solid">
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

function Projects() {
  const projects: Project[] | null = useLoaderData();
  useEffect(() => {
    document.title = "Trega | Проекты";
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

export default Projects;
