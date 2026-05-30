import { createListCollection, Portal, Select } from "@chakra-ui/react";
import { useMemo } from "react";
import type {
	Column,
	UUID,
} from "../../../shared/api/openapi/components/schemas";
import { useColumns } from "../../column";

export type ColumnSelectProps = {
	projectUUID: UUID;
	value: string;
	setValue: (v: string) => void;
};

export function ColumnSelect({
	projectUUID,
	value,
	setValue,
}: ColumnSelectProps) {
	const { data: columns } = useColumns(projectUUID);
	const collection = useMemo(
		() =>
			createListCollection<Column>({
				items: columns ?? [],
				itemToValue: (s) => s.id.toString(),
				itemToString: (s) => s.name,
			}),
		[columns],
	);
	return (
		<Select.Root
			collection={collection}
			value={value ? [value] : []}
			onValueChange={(e) => setValue(e.value.at(0)!)}
		>
			<Select.HiddenSelect />
			<Select.Control>
				<Select.Trigger>
					<Select.ValueText placeholder="Не выбрана" />
				</Select.Trigger>
				<Select.IndicatorGroup>
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
