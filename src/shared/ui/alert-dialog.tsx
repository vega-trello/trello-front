import { Button, createOverlay, Dialog, Portal } from "@chakra-ui/react";
import type React from "react";
import { useCallback } from "react";

export type AlertDialodProps = {
	title: string;
	body: React.ReactNode;
};

export function createAlertDialog({ title, body }: AlertDialodProps) {
	return createOverlay<{ callback: () => void }>(
		({ open, onOpenChange, callback }) => {
			const handleClose = useCallback(
				() => onOpenChange?.({ open: false }),
				[onOpenChange],
			);

			return (
				<Dialog.Root
					role="alertdialog"
					open={open}
					onOpenChange={(e) => !e.open && handleClose()}
					motionPreset="slide-in-bottom"
					placement="top"
				>
					<Portal>
						<Dialog.Backdrop />
						<Dialog.Positioner>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>{title}</Dialog.Title>
								</Dialog.Header>
								<Dialog.Body>{body}</Dialog.Body>
								<Dialog.Footer>
									<Dialog.ActionTrigger asChild>
										<Button variant="outline">Отменить</Button>
									</Dialog.ActionTrigger>
									<Dialog.ActionTrigger>
										<Button colorPalette="red" onClick={callback}>
											Удалить
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
}
