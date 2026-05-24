import { Button, createOverlay, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import type { Column } from "../../../shared/api/openapi/components/schemas";
import { useCallback, useRef, useState } from "react";
import { useUpdateColumn } from "../model/use-column-mutation";

export const renameDialog = createOverlay<{ column: Column }>(
	({ column, open, onOpenChange }) => {
		const ref = useRef<HTMLInputElement | null>(null);
		const [name, setName] = useState(column.name);
		const updateColumn = useUpdateColumn();

		const handleClose = useCallback(
			() => onOpenChange?.({ open: false }),
			[onOpenChange],
		);

		const submit = useCallback(() => {
			updateColumn.mutate(
				{
					columnID: column.id,
					name,
				},
				{ onSuccess: handleClose },
			);
		}, [updateColumn, name, column, handleClose]);

		return (
			<Dialog.Root
				open={open}
				onOpenChange={(e) => !e.open && handleClose()}
				initialFocusEl={() => ref.current}
				motionPreset="slide-in-bottom"
				placement="center"
			>
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
											placeholder="Новое название"
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
										Переименовать
									</Button>
								</Dialog.ActionTrigger>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		);
	},
);