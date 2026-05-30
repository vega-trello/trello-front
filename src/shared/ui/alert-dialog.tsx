import {
	Button,
	createOverlay,
	Dialog,
	Portal,
	type ButtonProps,
} from "@chakra-ui/react";
import type React from "react";

export type AlertDialodProps = {
	title: string;
	body: React.ReactNode;
	btnText?: string;
	color?: ButtonProps["colorPalette"];
};

export function createAlertDialog({
	title,
	body,
	btnText,
	color,
}: AlertDialodProps) {
	return createOverlay<{ callback: () => void; isPending?: boolean }>(
		({ callback, isPending, ...rest }) => {
			return (
				<Dialog.Root
					{...rest}
					role="alertdialog"
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
									<Dialog.ActionTrigger asChild>
										<Button
											colorPalette={color ?? "red"}
											onClick={callback}
											loading={isPending}
										>
											{btnText ?? "Удалить"}
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
