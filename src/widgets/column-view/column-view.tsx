import { For, HStack } from "@chakra-ui/react";
import { useColumns, Column } from "../../entities/column";
import type { UUID } from "../../shared/api/openapi/components/schemas";
import { ErrorAlert, Loader } from "../";
import { AddColumnButton } from "./add-column-button";
import { deleteDialog, renameDialog } from "../../entities/column";
import { useCallback, type PropsWithChildren } from "react";
import { errorMessage, toaster, useTitle } from "../../shared";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { useMoveTask } from "../../entities/task";
import type { integer } from "../../shared/api/openapi/components/schemas/integer";

function ColumnWrapper({ children }: PropsWithChildren) {
	return (
		<div
			className="column-wrapper"
			style={{ width: "280px", flexShrink: "0", height: "100%" }}
		>
			{children}
		</div>
	);
}

export function ColumnView({ projectUUID }: { projectUUID: UUID }) {
	const { data: columns, isError, error, isPending } = useColumns(projectUUID);
	const moveTask = useMoveTask();
	useTitle("Доска");

	const handleDrop = useCallback(
		(evt: DragEndEvent) => {
			const { source, target } = evt.operation;
			if (!source || !target) return;

			const { taskID } = source.data as { taskID: integer };
			const { columnID } = target.data as { columnID: integer };

			moveTask.mutate(
				{
					projectUUID,
					taskID,
					column_id: columnID,
				},
				{
					onError: (err) => toaster.error(errorMessage(err)),
				},
			);
		},
		[moveTask, projectUUID],
	);

	if (isError) return <ErrorAlert error={error} />;
	if (isPending) return <Loader size="xl" />;

	return (
		<HStack
			align="flex-start"
			flexGrow={1}
			padding="2"
			height="100%"
			overflowY="hidden"
		>
			<renameDialog.Viewport />
			<deleteDialog.Viewport />
			<DragDropProvider onDragEnd={handleDrop}>
				<For each={columns}>
					{(column) => (
						<ColumnWrapper key={column.id}>
							<Column projectUUID={projectUUID} columnID={column.id} />
						</ColumnWrapper>
					)}
				</For>
			</DragDropProvider>
			<ColumnWrapper>
				<AddColumnButton projectUUID={projectUUID} />
			</ColumnWrapper>
		</HStack>
	);
}
