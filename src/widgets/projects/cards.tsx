import {
	Card,
	For,
	Heading,
	IconButton,
	Menu,
	Portal,
	SimpleGrid,
	Text,
} from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";
import type { Project } from "../../shared/api/openapi/components/schemas";
import { type PropsWithChildren } from "react";

export type ProjectCallbacks = {
	onSelect: (project: Project) => void;
	onEdit: (project: Project) => void;
	onDelete: (project: Project) => void;
};

export type ProjectsCardsProps = {
	projects: Project[];
} & ProjectCallbacks;

const formatDate = (iso: string) => new Date(iso).toLocaleString();

function CardMenu({
	children,
	onEdit,
	onDelete,
	project,
}: PropsWithChildren & {
	project: Project;
	onEdit: (project: Project) => void;
	onDelete: (project: Project) => void;
}) {
	return (
		<Menu.Root>
			<Menu.Trigger asChild>{children}</Menu.Trigger>
			<Portal>
				<Menu.Positioner>
					<Menu.Content>
						<Menu.Item
							value="edit"
							onClick={(e) => {
								e.stopPropagation();
								onEdit(project);
							}}
						>
							Редактировать
						</Menu.Item>
						<Menu.Item
							value="delete"
							color="fg.error"
							_hover={{ bg: "bg.error", color: "fg.error" }}
							onClick={(e) => {
								e.stopPropagation();
								onDelete(project);
							}}
						>
							Удалить / Выйти
						</Menu.Item>
					</Menu.Content>
				</Menu.Positioner>
			</Portal>
		</Menu.Root>
	);
}

function ProjectCard({
	project,
	onSelect,
	onEdit,
	onDelete,
}: ProjectCallbacks & { project: Project }) {
	return (
		<Card.Root
			key={project.uuid}
			variant="elevated"
			cursor="pointer"
			onClick={() => onSelect(project)}
			onKeyDown={(e) => e.key === "Enter" && onSelect(project)}
			tabIndex={0}
			_hover={{ shadow: "md" }}
		>
			<Card.Header pb="2">
				<Heading size="md" lineClamp={1}>
					{project.title}
				</Heading>
				<CardMenu {...{ onDelete, onEdit, project }}>
					<IconButton
						aria-label="Действия"
						variant="ghost"
						size="sm"
						position="absolute"
						top="2"
						right="2"
						onClick={(e) => e.stopPropagation()}
					>
						<HiDotsVertical />
					</IconButton>
				</CardMenu>
			</Card.Header>

			<Card.Body>
				{project.description && (
					<Text color="fg.muted" whiteSpace="normal">
						{project.description}
					</Text>
				)}
			</Card.Body>

			<Card.Footer>
				<Text fontSize="sm" color="fg.subtle">
					{formatDate(project.created_at)}
				</Text>
			</Card.Footer>
		</Card.Root>
	);
}

export function ProjectsCards({ projects, ...rest }: ProjectsCardsProps) {
	return (
		<SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap="6" w="full">
			<For each={projects}>
				{(project) => (
					<ProjectCard key={project.uuid} project={project} {...rest} />
				)}
			</For>
		</SimpleGrid>
	);
}
