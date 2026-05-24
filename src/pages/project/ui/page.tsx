import { useParams, useSearchParams } from "react-router";
import { useEffect } from "react";
import { Heading, Spinner, Tabs } from "@chakra-ui/react";
import { FaBarsStaggered, FaTable, FaTableColumns } from "react-icons/fa6";
import { Sidebar } from "../../../widgets/sidebar";
import "./page.css";
import type { Project } from "../../../shared/api/openapi/components/schemas";
import { useProject } from "../../../entities/project";
import { ErrorAlert } from "../../../widgets/error-alert/ui/error-alert";
import { ColumnView } from "../../../widgets/column-view/ui/column-view";

export function Project() {
	const [query, setQuery] = useSearchParams();
	const { uuid } = useParams<{ uuid: string }>();
	const { data: project, isLoading, isError, error } = useProject(uuid ?? "");

	const tab = query.get("tab") ?? "columns";
	if (query.get("tab") == null)
		setTimeout(() =>
			setQuery((q) => ({ ...q, tab: "columns" }), { replace: true }),
		);

	useEffect(() => {
		document.title = `Trega | ${project?.title ?? ""}`;
	}, [project]);

	if (isError) return <ErrorAlert error={error} />;
	if (isLoading) return <Spinner size="xl" />;
	if (project === undefined) return <></>;

	return (
		<Tabs.Root
			as="div"
			className="project-tabs"
			orientation="vertical"
			value={tab}
			variant="enclosed"
			onValueChange={(tab) =>
				setQuery((q) => ({ ...q, tab: tab.value }), {
					replace: true,
				})
			}
		>
			<Sidebar>
				<Heading size="lg">{project?.title}</Heading>
				<Tabs.List>
					<Tabs.Trigger justifyContent="flex-start" value="columns">
						<FaTableColumns />
						Доска
					</Tabs.Trigger>
					<Tabs.Trigger justifyContent="flex-start" value="table">
						<FaTable />
						Таблица
					</Tabs.Trigger>
					<Tabs.Trigger justifyContent="flex-start" value="timeline">
						<FaBarsStaggered />
						Хронология
					</Tabs.Trigger>
				</Tabs.List>
			</Sidebar>
			<main id="tab-wrapper">
				<Tabs.Content value="columns">
					<ColumnView projectUUID={project.uuid} />
				</Tabs.Content>
				<Tabs.Content value="table">Table</Tabs.Content>
				<Tabs.Content value="timeline">Timeline</Tabs.Content>
			</main>
		</Tabs.Root>
	);
}
