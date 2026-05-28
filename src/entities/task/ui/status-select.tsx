import { useMemo } from "react";
import type { Status, UUID } from "../../../shared/api/openapi/components/schemas";
import { useStatuses } from "../../status";
import { createListCollection, Portal, Select } from "@chakra-ui/react";

type StatusSelectProps = {
	projectUUID: UUID;
	value: string | undefined;
	setValue: (e: string | undefined) => void;
};

export function StatusSelect({ projectUUID, value, setValue }: StatusSelectProps) {
	const { data: statuses } = useStatuses(projectUUID);
	const collection = useMemo(
		() =>
			createListCollection<Status>({
				items: statuses ?? [],
				itemToValue: (s) => s.id.toString(),
				itemToString: (s) => s.name,
			}),
		[statuses],
	);
	return (
		<Select.Root
			collection={collection}
			value={value ? [value] : []}
			onValueChange={(e) => setValue(e.value.at(0))}
		>
			<Select.HiddenSelect />
			<Select.Control>
				<Select.Trigger>
					<Select.ValueText placeholder="Не выбран" />
				</Select.Trigger>
				<Select.IndicatorGroup>
					<Select.ClearTrigger />
					<Select.Indicator />
				</Select.IndicatorGroup>
			</Select.Control>
			<Portal>
				<Select.Positioner>
					<Select.Content>
						{collection.items.map((status) => (
							<Select.Item item={status} key={status.name}>
								{status.name}
								<Select.ItemIndicator />
							</Select.Item>
						))}
					</Select.Content>
				</Select.Positioner>
			</Portal>
		</Select.Root>
	);
}