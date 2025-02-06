import { useQuery } from "@tanstack/react-query";
import { getTeam } from "../../api/team";
import CoreContainer from "../../components/CoreContainer";
import TeamChampionsTable from "../../components/Dashboard/Team/DashboardTeamChampionsTable";
import DashboardTeamSkeleton from "../../components/Dashboard/Team/DashboardTeamSkeleton";
import { useAuth } from "../../contexts/AuthContext";
import { useGroup } from "../../contexts/GroupContext";
import { useTeam } from "../../contexts/TeamContext";
import { GroupRole } from "../../types/Group";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import DashboardTeamEditModal from "../../components/Dashboard/Team/DashboardTeamEditModal";
import DashboardTeamEmpty from "../../components/Dashboard/Team/DashboardTeamEmpty";
import DashboardTeamDeleteModal from "../../components/Dashboard/Team/DashboardTeamDeleteModal";

const DashboardTeam = () => {
	const { user } = useAuth();
	const { selectedGroupId, groupData } = useGroup();
	const { selectedTeamId } = useTeam();

	const [openModalEditTeam, setOpenModalEditTeam] = useState<boolean>(false);
	const [openModalDeleteTeam, setOpenModalDeleteTeam] =
		useState<boolean>(false);

	const {
		data: teamData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["team", selectedTeamId],
		queryFn: () =>
			getTeam(
				user?.id ?? "",
				selectedGroupId ?? "",
				selectedTeamId ?? ""
			),
		enabled: !!selectedTeamId,
		staleTime: 1000 * 60 * 5,
	});

	const isOwner = groupData?.createdById === user?.id;
	const isAdmin = groupData?.members.some(
		(member) =>
			member.userId === user?.id && member.role === GroupRole.ADMIN
	);

	if (!selectedTeamId) {
		return <DashboardTeamEmpty />;
	}

	if (isLoading) {
		return <DashboardTeamSkeleton />;
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
							{teamData?.team?.name || "Team Name"}
						</h1>
						{(isOwner || isAdmin) && (
							<div
								className="flex gap-2 items-center p-1 s-sm:p-2 cursor-pointer border rounded-md hover:text-accent-light-3 transition-all"
								onClick={() => setOpenModalEditTeam(true)}
							>
								<Pencil className="w-4 h-4" />
								<p className="text-sm s-sm:text-base">Edit</p>
							</div>
						)}
					</div>

					<div id="description" className="flex flex-col">
						<p className="text-sm text-gray-light-6">
							{teamData?.team?.description || "Team Description"}
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
									Composition
								</h2>
							</div>

							<div className="flex gap-2">
								{(isOwner || isAdmin) && (
									<div
										className="flex gap-2 items-center p-1 s-sm:p-2 cursor-pointer border rounded-md text-danger-dark-2 hover:text-text hover:bg-danger-dark-2 transition-all"
										onClick={() =>
											setOpenModalDeleteTeam(true)
										}
									>
										<Trash className="w-6 h-6" />
										<p className="text-sm s-sm:text-base">
											Delete Team
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
							<TeamChampionsTable teamData={teamData?.team} />
						</div>
					</div>
				</div>
			</CoreContainer>

			{openModalEditTeam && (
				<DashboardTeamEditModal
					openModalEditTeam={openModalEditTeam}
					setOpenModalEditTeam={setOpenModalEditTeam}
					team={teamData?.team}
				/>
			)}

			{openModalDeleteTeam && (
				<DashboardTeamDeleteModal
					openModalDeleteTeam={openModalDeleteTeam}
					setOpenModalDeleteTeam={setOpenModalDeleteTeam}
				/>
			)}
		</>
	);
};

export default DashboardTeam;
