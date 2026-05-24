import { For, HStack, Spinner } from "@chakra-ui/react";
import { useColumns } from "../../../entities/column/model/use-column";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { ErrorAlert } from "../../error-alert/ui/error-alert";
import { AddColumnButton } from "./add-column-button";
import { EmptyColumn, Column } from "../../../entities/column";

export function ColumnView({ projectUUID }: { projectUUID: UUID }) {
	const { data: columns, isError, error, isLoading } = useColumns(projectUUID);

	if (isError) return <ErrorAlert error={error} />;
	if (isLoading) return <Spinner size="lg" />;
	if (columns === undefined) return <>Watafaq</>;

	return (
		<HStack align="flex-start" flexGrow={1}>
			<EmptyColumn projectUUID={projectUUID} />
			<For each={columns}>
				{(column) => (
					<Column
						key={column.id}
						projectUUID={projectUUID}
						columnID={column.id}
					/>
				)}
			</For>
			<AddColumnButton projectUUID={projectUUID} />
		</HStack>
	);
}
