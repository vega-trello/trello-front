import { Box, For, Spinner, VStack } from "@chakra-ui/react";
import type { UUID } from "../../../shared/api/openapi/components/schemas";
import { useTasks } from "../../task/model/use-task";
import { ErrorAlert } from "../../../widgets/error-alert/ui/error-alert";

export type ColumnProps = { projectUUID: UUID };

export function EmptyColumn({ projectUUID }: ColumnProps) {
	const { data: allTasks, isLoading, isError, error } = useTasks(projectUUID);
	const tasks = allTasks?.filter((task) => task.column_id === undefined);

	if (isError) return <ErrorAlert error={error} />;
	if (isLoading) return <Spinner />;
	if (allTasks === undefined) return <>Watafaq</>;

	return (
		<Box
			bg="bg.subtle"
			borderRadius="lg"
			p={4}
			w="280px"
			minH="100px"
			display="flex"
			flexDirection="column"
			flexShrink={0}
		>
			<VStack gap={2} overflowY="auto" flex={1} pr={1} scrollbarWidth="thin">
				{tasks !== undefined ? (
					<For each={tasks}>{(task) => <span>{task.title}</span>}</For>
				) : (
					<Spinner />
				)}
			</VStack>
		</Box>
	);
}
