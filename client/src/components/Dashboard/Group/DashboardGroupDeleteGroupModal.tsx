import { useMutation } from "@tanstack/react-query";
import { deleteGroup } from "../../../api/groups";
import { useAuth } from "../../../contexts/AuthContext";
import { useGroup } from "../../../contexts/GroupContext";
import { ReactSetState } from "../../../types/ReactTypes";
import Modal from "../../Modal";
import { toast } from "sonner";

const DashboardGroupDeleteGroupModal = ({
	openModalDeleteGroup,
	setOpenModalDeleteGroup,
}: {
	openModalDeleteGroup: boolean;
	setOpenModalDeleteGroup: ReactSetState<boolean>;
}) => {
	const { user } = useAuth();
	const { selectedGroupId } = useGroup();

	const deleteGroupMutation = useMutation({
		mutationFn: async () => {
			if (user && selectedGroupId) {
				return deleteGroup(user.id, selectedGroupId);
			}
			throw new Error("User or selected group ID is null");
		},
		onSuccess: () => {
			window.location.reload();
			setOpenModalDeleteGroup(false);
		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(`Failed to delete group: ${error.message}`, {
					style: {
						padding: "16px",
					},
				});
				return;
			}
			return;
		},
	});

	const handleDeleteGroup = () => {
		deleteGroupMutation.mutate();
		setOpenModalDeleteGroup(false);
	};

	return (
		<Modal
			isOpen={openModalDeleteGroup}
			onClose={() => setOpenModalDeleteGroup(false)}
			closeOnClickOutside={true}
		>
			<div id="modal-content" className="flex flex-col gap-5">
				<p className="text-base font-semibold font-sora">
					Delete group
				</p>
				<p className="text-sm">
					Are you sure you want to delete the group? This action
					cannot be undone.
				</p>
				<div className="flex gap-4 justify-end">
					<button
						className="btn-danger-outline p-2"
						onClick={() => setOpenModalDeleteGroup(false)}
					>
						Cancel
					</button>
					<button
						className="btn-danger p-2"
						onClick={() => handleDeleteGroup()}
					>
						Delete
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DashboardGroupDeleteGroupModal;
