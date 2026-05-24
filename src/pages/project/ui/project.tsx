import { useParams, useSearchParams } from "react-router";
import { Spinner, Tabs } from "@chakra-ui/react";
import { FaTableColumns } from "react-icons/fa6";
import type { Project } from "../../../shared/api/openapi/components/schemas";
import { useProject } from "../../../entities/project";
import { useSetHeading } from "../../../shared";
import { FaInfo, FaTags } from "react-icons/fa";
import "./project.css";
import {
	ArchiveView,
	ColumnView,
	ErrorAlert,
	MemberView,
	RoleView,
	Sidebar,
	StatusView,
	TagView,
} from "../../../widgets";
import { MdAccountBox, MdArchive, MdBadge } from "react-icons/md";

function TabL(value: string, content: React.ReactNode) {
	return (
		<Tabs.Trigger justifyContent="flex-start" value={value}>
			{content}
		</Tabs.Trigger>
	);
}
function TabV(value: string, content: React.ReactNode) {
	return <Tabs.Content value={value}>{content}</Tabs.Content>;
}

export function Project() {
	const [query, setQuery] = useSearchParams();
	const { uuid } = useParams<{ uuid: string }>();
	const { data: project, isLoading, isError, error } = useProject(uuid ?? "");
	useSetHeading(project?.title);

	const tab = query.get("tab") ?? "table";

	if (isError) return <ErrorAlert error={error} />;
	if (isLoading) return <Spinner size="xl" />;
	if (project === undefined) return <></>;

	return (
		<Tabs.Root
			lazyMount
			unmountOnExit
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
				<div
					style={{
						height: "100%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
					}}
				>
					<Tabs.List width="100%">
						{TabL(
							"table",
							<>
								<FaTableColumns />
								Доска
							</>,
						)}
						{TabL(
							"tag",
							<>
								<FaTags />
								Тэги
							</>,
						)}
						{TabL(
							"status",
							<>
								<FaInfo />
								Статусы
							</>,
						)}
						{TabL(
							"role",
							<>
								<MdBadge />
								Роли
							</>,
						)}
						{TabL(
							"member",
							<>
								<MdAccountBox />
								Участники
							</>,
						)}
					</Tabs.List>
					<Tabs.List>
						{TabL(
							"archive",
							<>
								<MdArchive />
								Архив
							</>,
						)}
					</Tabs.List>
				</div>
			</Sidebar>
			<main id="tab-wrapper">
				{TabV("table", <ColumnView projectUUID={project.uuid} />)}
				{TabV("tag", <TagView projectUUID={project.uuid} />)}
				{TabV("status", <StatusView projectUUID={project.uuid} />)}
				{TabV("role", <RoleView projectUUID={project.uuid} />)}
				{TabV("member", <MemberView projectUUID={project.uuid} />)}
				{TabV("archive", <ArchiveView projectUUID={project.uuid} />)}
			</main>
		</Tabs.Root>
	);
}
