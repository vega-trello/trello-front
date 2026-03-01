import {
  Button,
  Dialog,
  Field,
  For,
  Heading,
  Input,
  Portal,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import "./Library.css";
import { useEffect, useRef } from "react";
import { NavLink } from "react-router";

function AddProjectButton() {
  const ref = useRef<HTMLInputElement | null>(null);
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
                  <Input placeholder="Название" ref={ref} />
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="ghost">Отменить</Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger>
                <Button variant="solid">Создать</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

function Library() {
  useEffect(() => {
    document.title = "Trega | Проекты";
  });

  const projectUUIDs = [
    "c888e595-fae0-43ed-b04a-f5275b49903e",
    "964e4e04-cf85-49c5-99b0-bd37834172d8",
    "682e1c89-ce5a-40da-b8c5-21a346442762",
    "996a70f5-e3b6-49a2-8e49-3715ff77ec2d",
    "bf186d90-9fe6-45c9-9710-798f233070e5",
    "384306dd-1451-452d-8922-43f2594e95f3",
    "9d229ee8-3ba8-49bb-a0a2-bd0c76502cf5",
    "3dc0c1eb-262d-4ae0-a4a5-06e94ccc2853",
    "1c9da3c0-ce4f-408b-b8d0-19022ad3fe66",
    "180ebb2e-703b-46d9-82fb-cd82f89f86ac",
  ];
  return (
    <div id="library">
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
          <For each={projectUUIDs}>
            {(uuid) => (
              <Table.Row key={uuid}>
                <Table.Cell>
                  <NavLink to={"/project/" + uuid}>
                    <Text alignItems="center" display="flex" gap="2">
                      {uuid}
                    </Text>
                  </NavLink>
                </Table.Cell>
                <Table.Cell>01.01.2001</Table.Cell>
                <Table.Cell>10.10.2010</Table.Cell>
              </Table.Row>
            )}
          </For>
        </Table.Body>
      </Table.Root>
      <AddProjectButton />
    </div>
  );
}

export default Library;
