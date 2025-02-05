import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { getChampions } from "../../api/champions";
import { createTeam } from "../../api/team";
import { useAuth } from "../../contexts/AuthContext";
import { useGroup } from "../../contexts/GroupContext";
import { ReactSetState } from "../../types/ReactTypes";
import { TeamBody } from "../../types/Team";
import Modal from "../Modal";
import ChampionSelector from "./ChampionSelector";
import TeamComposition from "./TeamComposition";
import TeamForm from "./TeamForm";

interface CreateTeamModalProps {
	openModalCreateTeam: boolean;
	setOpenModalCreateTeam: ReactSetState<boolean>;
}

const CreateTeamModal = ({
	openModalCreateTeam,
	setOpenModalCreateTeam,
}: CreateTeamModalProps) => {
	const { user } = useAuth();
	const { selectedGroupId } = useGroup();

	const queryClient = useQueryClient();

	const [teamData, setTeamData] = useState<TeamBody>({
		name: "",
		description: "",
		members: [undefined, undefined, undefined, undefined, undefined],
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const { data: champions } = useQuery({
		queryKey: ["champions"],
		queryFn: () => getChampions(),
		staleTime: 1000 * 60 * 5,
	});

	const createTeamMutation = useMutation({
		mutationFn: async () =>
			createTeam(user?.id ?? "", selectedGroupId ?? "", teamData),
		onSuccess: () => {
			setOpenModalCreateTeam(false);
			queryClient.invalidateQueries({ queryKey: ["teams"] });
			toast.success("Team created successfully", {
				style: {
					padding: "16px",
				},
				position: "top-right",
			});
		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(`Failed to create team: ${error.message}`, {
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
			isOpen={openModalCreateTeam}
			onClose={() => setOpenModalCreateTeam(false)}
			closeOnClickOutside={false}
			sizeClassName="max-w-3xl"
		>
			<div className="flex flex-col gap-4">
				<h2 className="text-xl font-bold">Create a new team</h2>
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
						onClick={() => setOpenModalCreateTeam(false)}
					>
						Cancel
					</button>
					<button
						className="btn-primary p-2"
						onClick={() => createTeamMutation.mutate()}
						disabled={
							createTeamMutation.isPending ||
							!teamData.name ||
							teamData.members.filter(Boolean).length < 5
						}
					>
						Create Team
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default CreateTeamModal;
