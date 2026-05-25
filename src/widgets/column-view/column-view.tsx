import { For, HStack, Spinner } from "@chakra-ui/react";
import { useColumns, Column } from "../../entities/column";
import type { UUID } from "../../shared/api/openapi/components/schemas";
import { ErrorAlert, Loader } from "../";
import { AddColumnButton } from "./add-column-button";
import { deleteDialog, renameDialog } from "../../entities/column";
import { type PropsWithChildren } from "react";
import { useTitle } from "../../shared";

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
	const { data: columns, isError, error, isLoading } = useColumns(projectUUID);

	useTitle("Доска");

	if (isError) return <ErrorAlert error={error} />;
	if (isLoading) return <Loader size="xl" />;
	if (columns === undefined) return <>Что-то пошло не так</>;

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
			<For each={columns}>
				{(column) => (
					<ColumnWrapper key={column.id}>
						<Column projectUUID={projectUUID} columnID={column.id} />
					</ColumnWrapper>
				)}
			</For>
			<ColumnWrapper>
				<AddColumnButton projectUUID={projectUUID} />
			</ColumnWrapper>
		</HStack>
	);
}
