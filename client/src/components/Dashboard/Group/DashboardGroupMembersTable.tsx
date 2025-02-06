import { Trash2 } from "lucide-react";
import iconProfileUnknown from "../../../assets/icons/profileIconUnknown.jpg";
import { BtnGroupRole } from "../../../pages/dashboard/DashboardGroup";
import {
	Group,
	GroupMembershipExtraInfo,
	GroupRole,
} from "../../../types/Group";
import { ReactSetState } from "../../../types/ReactTypes";
import DataTable, { Column } from "../../DataTable";

interface GroupMembersTableProps {
	groupData: Group | null;
	canRemoveMember: (role: GroupRole) => boolean;
	setSelectedMember: ReactSetState<GroupMembershipExtraInfo | null>;
	setOpenModalRemoveMemberGroup: ReactSetState<boolean>;
}

const GroupMembersTable = ({
	groupData,
	canRemoveMember,
	setSelectedMember,
	setOpenModalRemoveMemberGroup,
}: GroupMembersTableProps) => {
	const columns: Column<GroupMembershipExtraInfo>[] = [
		{ key: "avatar", header: "Avatar" },
		{ key: "summonerName", header: "Summoner Name" },
		{ key: "username", header: "Username" },
		{ key: "email", header: "Email" },
		{ key: "role", header: "Role" },
		{ key: "actions", header: "Actions" },
	] as Column<GroupMembershipExtraInfo>[];

	const renderCell = (
		key: keyof GroupMembershipExtraInfo | "actions",
		member: GroupMembershipExtraInfo
	) => {
		switch (key) {
			case "avatar":
				return (
					<img
						src={member.avatar || iconProfileUnknown}
						alt={member.username}
						className="w-10 h-10 s-sm:w-16 s-sm:h-16 object-cover rounded-full"
					/>
				);
			case "summonerName":
				return member.summonerName || "Unknown";
			case "role":
				return <BtnGroupRole role={member.role} />;
			case "actions":
				return (
					canRemoveMember(member.role) && (
						<Trash2
							size={30}
							className="p-1 bg-danger-dark-1 rounded cursor-pointer hover:bg-danger-dark-3 transition-all"
							onClick={(e) => {
								e.stopPropagation();
								setSelectedMember(member);
								setOpenModalRemoveMemberGroup(true);
							}}
						/>
					)
				);
			case "username":
				return member.username;
			case "email":
				return member.email;
			default:
				return "N/A";
		}
	};

	return (
		<DataTable
			columns={columns}
			data={groupData?.members || []}
			renderCell={renderCell}
		/>
	);
};

export default GroupMembersTable;
