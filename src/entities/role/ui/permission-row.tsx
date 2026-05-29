import { Flex, Switch, Text } from "@chakra-ui/react";
import type { integer } from "../../../shared/api/openapi/components/schemas/integer";
import type { Permission } from "../../../shared/api/openapi/components/schemas";

type PermissionRowProps = {
	permission: Permission;
	checked: boolean;
	onToggle: (id: integer) => void;
};

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
			>
				<Switch.HiddenInput />
				<Switch.Control />
				<Switch.Label>
					<Flex
						flexDirection="column"
						gap="0.5"
						flex={1}
						cursor="pointer"
						as="label"
					>
						<Text fontSize="sm" fontWeight={500}>
							{permission.name}
						</Text>
						{permission.description && (
							<Text fontSize="xs" color="gray.500">
								{permission.description}
							</Text>
						)}
					</Flex>
				</Switch.Label>
			</Switch.Root>
		</Flex>
	);
}
