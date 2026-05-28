import {
	Button,
	createOverlay,
	Dialog,
	Field,
	Input,
	Portal,
	Stack,
	Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { PasswordInput } from "./password-input"; // your existing component

type FieldType = "text" | "password" | "textarea";

type FieldConfig = {
	label: string;
	type: FieldType;
	placeholder?: string;
};

type FormDialogParams<T extends Record<string, string>> = {
	title: string;
	fields: { [K in keyof T]: FieldConfig };
	submitLabel?: string;
};

type FormDialogProps<T extends Record<string, string>> = {
	initialState: T;
	onSubmit: (values: T) => void;
	loading?: boolean;
};

export function createFormDialog<T extends Record<string, string>>({
	title,
	fields,
	submitLabel = "Сохранить",
}: FormDialogParams<T>) {
	return createOverlay<FormDialogProps<T>>((props) => {
		const { onSubmit, loading, initialState, ...rest } = props;
		const [values, setValues] = useState<T>({ ...initialState });

		const handleSubmit = () => {
			onSubmit(values);
		};

		const setValue = (key: keyof T, value: string) => {
			setValues((prev) => ({ ...prev, [key]: value }));
		};

		return (
			<Dialog.Root
				{...rest}
				onOpenChange={(e) => {
					if (!e.open) setValues({ ...initialState });
					rest.onOpenChange?.(e);
				}}
			>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>{title}</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<Stack gap="4">
									{(Object.keys(fields) as (keyof T)[]).map((key) => {
										const field = fields[key];
										const strKey = key as string;
										return (
											<Field.Root key={strKey}>
												<Field.Label>{field.label}</Field.Label>
												{field.type === "password" ? (
													<PasswordInput
														placeholder={field.placeholder}
														value={values[key]}
														onChange={(e) => setValue(key, e.target.value)}
													/>
												) : field.type === "textarea" ? (
													<Textarea
														placeholder={field.placeholder}
														value={values[key]}
														onChange={(e) => setValue(key, e.target.value)}
													/>
												) : (
													<Input
														type={field.type ?? "text"}
														placeholder={field.placeholder}
														value={values[key]}
														onChange={(e) => setValue(key, e.target.value)}
													/>
												)}
											</Field.Root>
										);
									})}
								</Stack>
							</Dialog.Body>
							<Dialog.Footer>
								<Dialog.ActionTrigger asChild>
									<Button variant="outline">Отмена</Button>
								</Dialog.ActionTrigger>
								<Button loading={loading} onClick={handleSubmit}>
									{submitLabel}
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		);
	});
}
