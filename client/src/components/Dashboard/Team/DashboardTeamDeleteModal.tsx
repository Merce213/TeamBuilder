import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeam } from "../../../api/team";
import { useAuth } from "../../../contexts/AuthContext";
import { useGroup } from "../../../contexts/GroupContext";
import { useTeam } from "../../../contexts/TeamContext";
import { ReactSetState } from "../../../types/ReactTypes";
import Modal from "../../Modal";
import { toast } from "sonner";

const DashboardTeamDeleteModal = ({
	openModalDeleteTeam,
	setOpenModalDeleteTeam,
}: {
	openModalDeleteTeam: boolean;
	setOpenModalDeleteTeam: ReactSetState<boolean>;
}) => {
	const { user } = useAuth();
	const { selectedGroupId } = useGroup();
	const { selectedTeamId } = useTeam();

	const queryClient = useQueryClient();

	const deleteTeamMutation = useMutation({
		mutationFn: async () => {
			if (user && selectedGroupId && selectedTeamId) {
				return deleteTeam(user.id, selectedGroupId, selectedTeamId);
			}
			throw new Error(
				"You must be logged in and have a group and team selected to delete a team"
			);
		},
		onSuccess: () => {
			setOpenModalDeleteTeam(false);
			queryClient.invalidateQueries({
				queryKey: ["teams"],
			});
			toast.success("Team deleted successfully", {
				style: {
					padding: "16px",
				},
				position: "top-right",
			});
		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(`Failed to delete team: ${error.message}`, {
					style: {
						padding: "16px",
					},
				});
				return;
			}
			return;
		},
	});

	return (
		<Modal
			isOpen={openModalDeleteTeam}
			onClose={() => setOpenModalDeleteTeam(false)}
			closeOnClickOutside={true}
		>
			<div id="modal-content" className="flex flex-col gap-5">
				<p className="text-base font-semibold font-sora">Delete team</p>
				<p className="text-sm">
					Are you sure you want to delete the team? This action cannot
					be undone.
				</p>
				<div className="flex gap-4 justify-end">
					<button
						className="btn-danger-outline p-2"
						onClick={() => setOpenModalDeleteTeam(false)}
					>
						Cancel
					</button>
					<button
						className="btn-danger p-2"
						onClick={() => deleteTeamMutation.mutate()}
					>
						Delete
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DashboardTeamDeleteModal;
