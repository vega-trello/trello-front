import { useLoaderData, useSearchParams } from "react-router";
import { useEffect } from "react";
import { Heading, Tabs } from "@chakra-ui/react";
import { FaBarsStaggered, FaTable, FaTableColumns } from "react-icons/fa6";
import { Sidebar } from "../../../widgets/sidebar";
import "./page.css";
import type { Project } from "../../../shared/api/openapi/components/schemas";

export function Project() {
	const [query, setQuery] = useSearchParams();
	const project: Project = useLoaderData();

	const tab = query.get("tab") ?? "columns";
	if (query.get("tab") == null)
		setTimeout(() =>
			setQuery((q) => ({ ...q, tab: "columns" }), { replace: true }),
		);

	useEffect(() => {
		document.title = `Trega | ${project.title}`;
	});

	return (
		<Tabs.Root
			as="div"
			id="project"
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
				<Heading size="lg">{project.title}</Heading>
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
			<Tabs.Content value="columns">Columns</Tabs.Content>
			<Tabs.Content value="table">Table</Tabs.Content>
			<Tabs.Content value="timeline">Timeline</Tabs.Content>
		</Tabs.Root>
	);
}
