import { useCallback } from "react";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import { useCreateTask } from "../../task";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { Button } from "@chakra-ui/react";
import { errorMessage, toaster } from "../../../shared";

export function AddTaskButton({
	projectUUID,
	columnID,
}: {
	projectUUID: UUID;
	columnID: integer;
}) {
	const createTask = useCreateTask();
	const create = useCallback(() => {
		createTask.mutate(
			{
				projectUUID,
				title: "",
				column_id: columnID,
				description: null,
				end_date: null,
				start_date: null,
			},
			{ onError: (err) => toaster.error(errorMessage(err)) },
		);
	}, [createTask, projectUUID, columnID]);

	return (
		<Button size="xs" variant="ghost" onClick={create}>
			+ Добавить карточку
		</Button>
	);
}
