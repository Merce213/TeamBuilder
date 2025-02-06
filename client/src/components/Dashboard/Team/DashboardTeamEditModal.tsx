import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getChampions } from "../../../api/champions";
import { useAuth } from "../../../contexts/AuthContext";
import { useGroup } from "../../../contexts/GroupContext";
import { useTeam } from "../../../contexts/TeamContext";
import { ReactSetState } from "../../../types/ReactTypes";
import { Team, TeamBody } from "../../../types/Team";
import Modal from "../../Modal";
import ChampionSelector from "../../Teams/ChampionSelector";
import TeamComposition from "../../Teams/TeamComposition";
import TeamForm from "../../Teams/TeamForm";
import { updateTeam } from "../../../api/team";

interface CreateTeamModalProps {
	openModalEditTeam: boolean;
	setOpenModalEditTeam: ReactSetState<boolean>;
	team: Team;
}

const DashboardTeamEditModal = ({
	openModalEditTeam,
	setOpenModalEditTeam,
	team,
}: CreateTeamModalProps) => {
	const { user } = useAuth();
	const { selectedGroupId } = useGroup();
	const { selectedTeamId } = useTeam();

	const queryClient = useQueryClient();

	const [teamData, setTeamData] = useState<TeamBody>({
		name: team.name ?? "",
		description: team.description ?? "",
		members: team.members ?? [],
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const { data: champions } = useQuery({
		queryKey: ["champions"],
		queryFn: () => getChampions(),
		staleTime: 1000 * 60 * 5,
	});

	const updateTeamMutation = useMutation({
		mutationFn: async () =>
			updateTeam(
				user?.id ?? "",
				selectedGroupId ?? "",
				selectedTeamId ?? "",
				teamData
			),
		onSuccess: () => {
			setOpenModalEditTeam(false);
			queryClient.invalidateQueries({
				queryKey: ["teams", user?.id, selectedGroupId],
			});
			queryClient.invalidateQueries({
				queryKey: ["team", selectedTeamId],
			});
			toast.success("Team updated successfully", {
				style: {
					padding: "16px",
				},
				position: "top-right",
			});
		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(`Failed to update team: ${error.message}`, {
					style: {
						padding: "16px",
					},
				});
				return;
			}
			setErrors(error);
			return;
		},
	});

	return (
		<Modal
			isOpen={openModalEditTeam}
			onClose={() => setOpenModalEditTeam(false)}
			closeOnClickOutside={false}
			sizeClassName="max-w-3xl"
		>
			<div className="flex flex-col gap-4">
				<h2 className="text-xl font-bold">Edit Team</h2>
				<TeamForm
					teamData={teamData}
					setTeamData={setTeamData}
					errors={errors}
					setErrors={setErrors}
				/>
				<ChampionSelector
					teamData={teamData}
					setTeamData={setTeamData}
					champions={champions}
				/>
				<TeamComposition
					teamData={teamData}
					setTeamData={setTeamData}
					champions={champions}
					errors={errors}
					setErrors={setErrors}
				/>
				<div className="flex justify-end gap-2">
					<button
						className="btn-danger-outline p-2"
						onClick={() => setOpenModalEditTeam(false)}
					>
						Cancel
					</button>
					<button
						className="btn-primary p-2"
						onClick={() => updateTeamMutation.mutate()}
						disabled={
							updateTeamMutation.isPending ||
							teamData.members.filter(Boolean).length < 5
						}
					>
						{updateTeamMutation.isPending ? "Saving..." : "Save"}
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DashboardTeamEditModal;
