import {
	Button,
	ColorPicker,
	createOverlay,
	Dialog,
	Field,
	parseColor,
	Portal,
	Stack,
} from "@chakra-ui/react";
import type {
	Color,
	Column,
} from "../../../shared/api/openapi/components/schemas";
import { useCallback, useRef, useState } from "react";
import { useUpdateColumn } from "../model/use-column-mutation";

export const colorDialog = createOverlay<{ column: Column }>(
	({ column, ...props }) => {
		const ref = useRef<HTMLInputElement | null>(null);
		const [color, setColor] = useState(
			column.color ? parseColor(column.color) : undefined,
		);
		const updateColumn = useUpdateColumn();

		const submit = useCallback(() => {
			updateColumn.mutate({
				columnID: column.id,
				name: column.name,
				color: color ? (color.toString("hexa") as Color) : null,
			});
		}, [updateColumn, color, column]);

		return (
			<Dialog.Root
				{...props}
				initialFocusEl={() => ref.current}
				motionPreset="slide-in-bottom"
				placement="center"
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Body>
								<Stack gap="4">
									<Field.Root>
										<Field.Label>Цвет</Field.Label>
										<ColorPicker.Root
											value={color}
											onValueChange={(e) => setColor(e.value)}
											format="hsla"
										>
											<ColorPicker.HiddenInput />
											<ColorPicker.Control>
												<ColorPicker.Trigger />
												<ColorPicker.Input />
											</ColorPicker.Control>
											<ColorPicker.Positioner>
												<ColorPicker.Content>
													<ColorPicker.Area />
													<ColorPicker.Sliders />
												</ColorPicker.Content>
											</ColorPicker.Positioner>
										</ColorPicker.Root>
									</Field.Root>
								</Stack>
							</Dialog.Body>
							<Dialog.Footer>
								<Dialog.ActionTrigger asChild>
									<Button variant="ghost">Отменить</Button>
								</Dialog.ActionTrigger>
								<Dialog.ActionTrigger asChild>
									<Button variant="solid" type="submit" onClick={submit}>
										Изменить
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
