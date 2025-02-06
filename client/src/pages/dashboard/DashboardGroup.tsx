import { useQuery } from "@tanstack/react-query";
import { CirclePlus, LogOut, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { getGroup } from "../../api/groups";
import CoreContainer from "../../components/CoreContainer";
import DashboardGroupDeleteGroupModal from "../../components/Dashboard/Group/DashboardGroupDeleteGroupModal";
import DashboardGroupEditModal from "../../components/Dashboard/Group/DashboardGroupEditModal";
import DashboardGroupInvitationModal from "../../components/Dashboard/Group/DashboardGroupInvitationModal";
import DashboardGroupLeaveModal from "../../components/Dashboard/Group/DashboardGroupLeaveModal";
import GroupMembersTable from "../../components/Dashboard/Group/DashboardGroupMembersTable";
import DashboardGroupRemoveMemberModal from "../../components/Dashboard/Group/DashboardGroupRemoveMemberModal";
import DashboardGroupSkeleton from "../../components/Dashboard/Group/DashboardGroupSkeleton";
import { useAuth } from "../../contexts/AuthContext";
import { useGroup } from "../../contexts/GroupContext";
import { GroupMembershipExtraInfo, GroupRole } from "../../types/Group";

export const BtnGroupRole = ({ role }: { role: GroupRole }) => {
	switch (role) {
		case GroupRole.OWNER:
			return (
				<span className="font-semibold uppercase p-1 bg-primary rounded-sm">
					Owner
				</span>
			);
		case GroupRole.ADMIN:
			return (
				<span className="font-semibold uppercase p-1 bg-danger-dark-3 rounded-sm">
					Admin
				</span>
			);
		case GroupRole.MEMBER:
			return (
				<span className="font-semibold uppercase p-1 bg-accent rounded-sm">
					Member
				</span>
			);
		default:
			return <span>Unknown</span>;
	}
};

const DashboardGroup = () => {
	const { user } = useAuth();
	const { selectedGroupId } = useGroup();
	const [openModalEditGroup, setOpenModalEditGroup] =
		useState<boolean>(false);
	const [openModalInvitationGroup, setOpenModalInvitationGroup] =
		useState<boolean>(false);
	const [openModalLeaveGroup, setOpenModalLeaveGroup] =
		useState<boolean>(false);

	const [selectedMember, setSelectedMember] =
		useState<GroupMembershipExtraInfo | null>(null);
	const [openModalRemoveMemberGroup, setOpenModalRemoveMemberGroup] =
		useState<boolean>(false);

	const [openModalDeleteGroup, setOpenModalDeleteGroup] =
		useState<boolean>(false);

	const {
		data: groupData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["group", user?.id, selectedGroupId],
		queryFn: () => getGroup(user?.id ?? "", selectedGroupId ?? ""),
		enabled: !!user && !!selectedGroupId,
		staleTime: 1000 * 60 * 5,
	});

	const isOwner = groupData?.group?.createdById === user?.id;
	const isAdmin = groupData?.group?.members.some(
		(member) =>
			member.userId === user?.id && member.role === GroupRole.ADMIN
	);

	const isAuthorized = (memberRole: GroupRole) => {
		if (isOwner) {
			return memberRole !== GroupRole.OWNER;
		}
		if (isAdmin) {
			return memberRole === GroupRole.MEMBER;
		}
		return false;
	};

	if (isLoading) {
		return <DashboardGroupSkeleton />;
	}

	if (isError) {
		return (
			<div>
				Error:{" "}
				{error instanceof Error
					? error.message
					: "Unknown error occurred. Retry later"}
			</div>
		);
	}

	return (
		<>
			<CoreContainer className="h-screen-navbar flex flex-col items-center justify-center">
				<div className="bg-secondary-dark-6 w-full max-w-screen-lg flex flex-col p-4 gap-4 s-md:gap-6 rounded-lg shadow-md">
					<div
						id="header"
						className="flex justify-between items-center gap-4 w-full"
					>
						<h1 className="text-base s-md:text-2xl font-sora font-bold">
							{groupData?.group?.name || "Group Name"}
						</h1>
						{(isOwner || isAdmin) && (
							<div
								className="flex gap-2 items-center p-1 s-sm:p-2 cursor-pointer border rounded-md hover:text-accent-light-3 transition-all"
								onClick={() => setOpenModalEditGroup(true)}
							>
								<Pencil className="w-4 h-4" />
								<p className="text-sm s-sm:text-base">Edit</p>
							</div>
						)}
					</div>

					<div id="description" className="flex flex-col">
						<p className="text-sm text-gray-light-6">
							{groupData?.group?.description ||
								"Group Description"}
						</p>
					</div>

					<hr className="bg-text h-px" />

					<div
						id="members"
						aria-label="members"
						className="flex flex-col gap-4"
					>
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<h2 className="text-sm s-md:text-base font-semibold">
									Members
								</h2>
								<p className="text-sm s-md:text-base">
									({groupData?.group?.members?.length})
								</p>
							</div>

							<div className="flex gap-2">
								{isOwner && (
									<div
										className="flex gap-2 items-center p-1 s-sm:p-2 cursor-pointer border rounded-md text-danger-dark-2 hover:text-text hover:bg-danger-dark-2 transition-all"
										onClick={() =>
											setOpenModalDeleteGroup(true)
										}
									>
										<Trash className="w-6 h-6" />
										<p className="text-sm s-sm:text-base">
											Delete Group
										</p>
									</div>
								)}
								{(isOwner || isAdmin) && (
									<div
										className="flex gap-2 items-center p-1 s-sm:p-2 cursor-pointer border rounded-md hover:text-accent-light-3 transition-all"
										onClick={() =>
											setOpenModalInvitationGroup(true)
										}
									>
										<CirclePlus className="w-6 h-6" />
										<p className="text-sm s-sm:text-base">
											Invite Members
										</p>
									</div>
								)}
								{!isOwner && (
									<div
										className="flex gap-2 items-center p-1 s-sm:p-2 cursor-pointer border rounded-md text-danger-dark-2 hover:text-text hover:bg-danger-dark-2 transition-all"
										onClick={() =>
											setOpenModalLeaveGroup(true)
										}
									>
										<LogOut className="w-6 h-6" />
										<p className="text-sm s-sm:text-base">
											Leave Group
										</p>
									</div>
								)}
							</div>
						</div>

						<div
							id="members-list"
							aria-label="members-list"
							className="w-full overflow-x-auto overflow-y-auto max-h-96"
						>
							<GroupMembersTable
								groupData={groupData?.group ?? null}
								canRemoveMember={isAuthorized}
								setSelectedMember={setSelectedMember}
								setOpenModalRemoveMemberGroup={
									setOpenModalRemoveMemberGroup
								}
							/>
						</div>
					</div>
				</div>
			</CoreContainer>

			{openModalEditGroup && (
				<DashboardGroupEditModal
					openModalEditGroup={openModalEditGroup}
					setOpenModalEditGroup={setOpenModalEditGroup}
				/>
			)}

			{openModalInvitationGroup && (
				<DashboardGroupInvitationModal
					openModalInvitationGroup={openModalInvitationGroup}
					setOpenModalInvitationGroup={setOpenModalInvitationGroup}
				/>
			)}

			{openModalLeaveGroup && (
				<DashboardGroupLeaveModal
					openModalLeaveGroup={openModalLeaveGroup}
					setOpenModalLeaveGroup={setOpenModalLeaveGroup}
				/>
			)}

			{openModalRemoveMemberGroup && (
				<DashboardGroupRemoveMemberModal
					openModalRemoveMemberGroup={openModalRemoveMemberGroup}
					setOpenModalRemoveMemberGroup={
						setOpenModalRemoveMemberGroup
					}
					selectedMember={selectedMember}
				/>
			)}

			{openModalDeleteGroup && (
				<DashboardGroupDeleteGroupModal
					openModalDeleteGroup={openModalDeleteGroup}
					setOpenModalDeleteGroup={setOpenModalDeleteGroup}
				/>
			)}
		</>
	);
};

export default DashboardGroup;
