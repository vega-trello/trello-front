import { Button, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { useCreateColumn } from "../../../entities/column/model/use-column-mutation";
import { useRef, useState } from "react";
import { toaster } from "../../../shared";
import { errorMessage } from "../../../shared/model/error-message";

export function AddColumnButton({ projectUUID }: { projectUUID: UUID }) {
	const ref = useRef<HTMLInputElement | null>(null);
	const [name, setName] = useState("");

	const createColumn = useCreateColumn();

	const submit = () => {
		createColumn.mutate(
			{ projectUUID, name },
			{
				onSuccess: () => setName(""),
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	};

	return (
		<Dialog.Root
			initialFocusEl={() => ref.current}
			motionPreset="slide-in-bottom"
			placement="center"
		>
			<Dialog.Trigger display="contents" as="div">
				<Button id="add-project" variant="outline">
					+
				</Button>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Новая колонка</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Stack gap="4">
								<Field.Root>
									<Field.Label>Название</Field.Label>
									<Input
										placeholder="Название"
										ref={ref}
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</Field.Root>
							</Stack>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="ghost">Отменить</Button>
							</Dialog.ActionTrigger>
							<Dialog.ActionTrigger asChild>
								<Button variant="solid" type="submit" onClick={submit}>
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
