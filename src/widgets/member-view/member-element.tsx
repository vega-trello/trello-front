import { useCallback } from "react";
import { useDeleteMember } from "../../entities/member/model/use-member-mutations";
import { errorMessage, toaster, Tooltip } from "../../shared";
import type { Member } from "../../shared/api/openapi/components/schemas";
import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { deleteDialog } from "./delete-dialog";
import { useSelf } from "../../entities/user";
import { useRole } from "../../entities/role";

type MemberElementProps = {
	member: Member;
};
export function MemberElement({ member }: MemberElementProps) {
	const { data: user } = useSelf();
	const { data: role } = useRole(member.project_uuid, member.role_id);
	const isSelf = user?.uuid === member.uuid;
	const deleteMember = useDeleteMember();

	const handleDelete = useCallback(() => {
		deleteMember.mutate(
			{
				projectUUID: member.project_uuid,
				userUUID: member.uuid,
			},
			{
				onError: (err) => toaster.error(errorMessage(err)),
			},
		);
	}, [deleteMember, member]);

	return (
		<Box display="flex" alignItems="center" justifyContent="space-between">
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				gap="4"
			>
				<HStack alignItems="center">
					<Tooltip
						content={<Text fontFamily="mono">{member.uuid}</Text>}
						interactive
					>
						{isSelf ? (
							<Text fontWeight="bold">Вы</Text>
						) : (
							<Text>{member.username}</Text>
						)}
					</Tooltip>
					<Text color="fg.subtle">[{role?.name}]</Text>
				</HStack>
			</Box>
			{!isSelf && (
				<Box>
					{/* <TagEdit projectUUID={projectUUID} tag={tag}> */}
					<IconButton variant="ghost">
						<HiOutlinePencilAlt />
					</IconButton>
					{/* </TagEdit> */}
					<IconButton
						loading={deleteMember.isPending}
						variant="ghost"
						colorPalette="red"
						onClick={() =>
							deleteDialog.open("delete-tag", { callback: handleDelete })
						}
					>
						<HiOutlineTrash />
					</IconButton>
				</Box>
			)}
		</Box>
	);
}
