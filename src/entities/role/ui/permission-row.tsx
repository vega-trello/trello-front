import { Flex, Switch, Text } from "@chakra-ui/react";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import type { Permission } from "../../../shared/api/openapi/components/schemas";

type PermissionRowProps = {
	permission: Permission;
	checked: boolean;
	onToggle: (id: integer) => void;
};

function toDisplayName(str: string): string {
	return str
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function PermissionRow({
	permission,
	checked,
	onToggle,
}: PermissionRowProps) {
	return (
		<Flex align="center" gap={3}>
			<Switch.Root
				checked={checked}
				onCheckedChange={() => onToggle(permission.id)}
				mt={0.5}
				flexGrow={1}
			>
				<Switch.HiddenInput />
				<Switch.Control />
				<Switch.Label
					flexDirection="column"
					gap="0.5"
					cursor="pointer"
					flexGrow={1}
				>
					<Text fontSize="sm" fontWeight={500}>
						{toDisplayName(permission.name)}
					</Text>
					{permission.description && (
						<Text fontSize="xs" color="gray.500">
							{permission.description}
						</Text>
					)}
				</Switch.Label>
			</Switch.Root>
		</Flex>
	);
}
