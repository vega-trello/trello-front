import { Badge, Flex, Text } from "@chakra-ui/react";
import type {
	Assignee,
	Task,
} from "../../../shared/api/openapi/components/schemas";
import {
	HiOutlineClock,
	HiOutlineEye,
	HiOutlineMenuAlt2,
} from "react-icons/hi";
import { useSelf } from "../../user";
import { useMemo } from "react";

function formatShortDate(date: Date): string {
	return new Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "short",
	}).format(date);
}

function getDaysUntilDeadline(endDate: string): number {
	const nowRaw = new Date();
	const now = Date.UTC(
		nowRaw.getFullYear(),
		nowRaw.getMonth(),
		nowRaw.getDay(),
	);
	const dRaw = new Date(endDate);
	const deadline = Date.UTC(dRaw.getFullYear(), dRaw.getMonth(), dRaw.getDay());
	const diffMs = deadline - now;
	return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function TaskModifiers({
	task,
	assignees,
}: {
	task: Task;
	assignees: Assignee[];
}) {
	const { data: user } = useSelf();
	const subscribed = assignees.some((a) => a.user_uuid === user?.uuid);
	const start_date = useMemo(
		() => (task.start_date ? formatShortDate(new Date(task.start_date)) : null),
		[task.start_date],
	);
	const end_date = useMemo(
		() => (task.end_date ? formatShortDate(new Date(task.end_date)) : null),
		[task.end_date],
	);
	const time = start_date !== null || end_date !== null;
	const description =
		task.description !== null && task.description.trim().length !== 0;
	const deadline = useMemo(
		() => (task.end_date ? getDaysUntilDeadline(task.end_date) : null),
		[task.end_date],
	);

	return (
		<Flex display="inline-flex" alignItems="center" flexWrap="wrap" gap="1">
			{!task.done && deadline !== null && deadline <= 3 && (
				<Badge variant="outline" colorPalette="red" size="md">
					<span>🔥</span>
					{deadline > 1 ? (
						<>{deadline} дня</>
					) : deadline === 1 ? (
						<>{deadline} день</>
					) : deadline === 0 ? (
						<>сегодня</>
					) : (
						<>сгорел</>
					)}
				</Badge>
			)}
			{time && (
				<Badge variant="outline" size="md">
					<HiOutlineClock />
					<Text>
						{start_date && <>{start_date}</>}—{end_date && <>{end_date}</>}
					</Text>
				</Badge>
			)}
			{subscribed && (
				<Badge variant="outline" size="md" colorPalette="cyan">
					<HiOutlineEye />
				</Badge>
			)}
			{description && (
				<Badge variant="outline" size="md">
					<HiOutlineMenuAlt2 />
				</Badge>
			)}
		</Flex>
	);
}
