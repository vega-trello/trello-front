import { Box, Button, Input } from "@chakra-ui/react";
import type { UUID } from "../../shared/api/openapi/components/schemas";
import { useCreateColumn } from "../../entities/column";
import { useRef, useState } from "react";
import { toaster, errorMessage } from "../../shared";
import { HiX } from "react-icons/hi";

export function AddColumnButton({ projectUUID }: { projectUUID: UUID }) {
	const ref = useRef<HTMLInputElement | null>(null);
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState("");

	const createColumn = useCreateColumn();

	const submit = () => {
		createColumn.mutate(
			{ projectUUID, name, position: null },
			{
				onSuccess: () => setName(""),
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	};

	if (editing)
		return (
			<Box width="100%">
				<div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
					<Input
						placeholder="Название"
						size="sm"
						ref={ref}
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<div style={{ display: "flex", gap: "2px" }}>
						<Button
							variant="subtle"
							size="sm"
							flexGrow={1}
							loading={createColumn.isPending}
							onClick={() => {
								submit();
								setEditing(false);
							}}
						>
							Добавить
						</Button>
						<Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
							<HiX />
						</Button>
					</div>
				</div>
			</Box>
		);

	return (
		<Button
			width="100%"
			variant="subtle"
			onClick={() => {
				setEditing(true);
				setTimeout(() => ref.current?.focus());
			}}
		>
			+ Добавить колонку
		</Button>
	);
}
