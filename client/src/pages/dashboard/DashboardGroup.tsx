import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { getGroup } from "../../api/groups";
import iconProfileUnknown from "../../assets/icons/profileIconUnknown.jpg";
import CoreContainer from "../../components/CoreContainer";
import { useAuth } from "../../contexts/AuthContext";
import { useGroup } from "../../contexts/GroupContext";
import { GroupRole } from "../../types/Group";

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

	const {
		data: groupData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["group", user?.id, selectedGroupId],
		queryFn: () => getGroup(user?.id ?? "", selectedGroupId ?? ""),
	});

	console.log("groupData", groupData);

	return (
		<CoreContainer className="h-screen-navbar flex flex-col items-center justify-center">
			<div className="bg-secondary-dark-6 w-full max-w-screen-lg flex flex-col p-4 gap-4 s-md:gap-6 rounded-lg shadow-md">
				<div
					id="header"
					className="flex justify-between items-center gap-4 w-full"
				>
					<h1 className="text-base s-md:text-2xl font-sora font-bold">
						{groupData?.group?.name || "Group Name"}
					</h1>
					<div className="flex gap-2 items-center p-1 s-sm:p-2 cursor-pointer border rounded-md hover:text-accent-light-3 transition-all">
						<Pencil className="w-4 h-4" />
						<p className="text-sm s-sm:text-base">Edit</p>
					</div>
				</div>

				<div id="description" className="flex flex-col">
					<p className="text-sm text-gray-light-6">
						{groupData?.group?.description || "Group Description"}
					</p>
				</div>

				<hr className="bg-text h-px" />

				<div
					id="members"
					aria-label="members"
					className="flex flex-col gap-2"
				>
					<div className="flex items-center gap-2">
						<h2 className="text-sm s-md:text-base font-semibold">
							Members
						</h2>
						<p className="text-sm s-md:text-base">
							({groupData?.group?.members?.length})
						</p>
					</div>

					<div
						id="members-list"
						aria-label="members-list"
						className="w-full overflow-x-auto"
					>
						<table className="w-full">
							<thead className="bg-secondary-dark-7">
								<tr>
									<th className="p-3 text-left font-semibold">
										Avatar
									</th>
									<th className="p-3 text-left font-semibold">
										Summoner Name
									</th>
									<th className="p-3 text-left font-semibold">
										Username
									</th>
									<th className="p-3 text-left font-semibold">
										Email
									</th>
									<th className="p-3 text-left font-semibold">
										Role
									</th>
								</tr>
							</thead>
							<tbody>
								{groupData?.group?.members?.map((member) => (
									<tr
										key={member.id}
										className="border-b border-secondary-dark-7 hover:bg-secondary-dark-8 transition-all"
									>
										<td className="p-3">
											<img
												src={
													member.avatar ||
													iconProfileUnknown
												}
												alt={member.username}
												className="w-10 h-10 s-sm:w-16 s-sm:h-16 object-cover rounded-full"
											/>
										</td>
										<td
											className="p-3"
											style={{
												verticalAlign: "middle",
											}}
										>
											{member.summonerName || "Unknown"}
										</td>
										<td
											className="p-3"
											style={{
												verticalAlign: "middle",
											}}
										>
											{member.username}
										</td>
										<td
											className="p-3"
											style={{
												verticalAlign: "middle",
											}}
										>
											{member.email}
										</td>
										<td
											className="p-3"
											style={{
												verticalAlign: "middle",
											}}
										>
											<BtnGroupRole role={member.role} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</CoreContainer>
	);
};

export default DashboardGroup;
