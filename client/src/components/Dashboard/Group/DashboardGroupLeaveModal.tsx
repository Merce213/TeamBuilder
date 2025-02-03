import { useMutation } from "@tanstack/react-query";
import { leaveGroup } from "../../../api/groups";
import { useAuth } from "../../../contexts/AuthContext";
import { useGroup } from "../../../contexts/GroupContext";
import { ReactSetState } from "../../../types/ReactTypes";
import Modal from "../../Modal";

const DashboardGroupLeaveModal = ({
	openModalLeaveGroup,
	setOpenModalLeaveGroup,
}: {
	openModalLeaveGroup: boolean;
	setOpenModalLeaveGroup: ReactSetState<boolean>;
}) => {
	const { user } = useAuth();
	const { selectedGroupId } = useGroup();

	const leaveGroupMutation = useMutation({
		mutationFn: async () => leaveGroup(user?.id ?? "", selectedGroupId!),
		onSuccess: () => {
			setOpenModalLeaveGroup(false);
		},
	});

	const handleLeaveGroup = () => {
		leaveGroupMutation.mutate();
		setOpenModalLeaveGroup(false);

		window.location.reload();
	};

	return (
		<Modal
			isOpen={openModalLeaveGroup}
			onClose={() => setOpenModalLeaveGroup(false)}
			closeOnClickOutside={true}
		>
			<div id="modal-content" className="flex flex-col gap-5">
				<p className="text-lg font-semibold font-sora">Leave group</p>
				<p className="text-sm s-sm:text-base">
					Are you sure you want to leave the group?
				</p>
				<div className="flex gap-4 justify-end">
					<button
						className="btn-danger-outline p-2"
						onClick={() => setOpenModalLeaveGroup(false)}
					>
						Cancel
					</button>
					<button
						className="btn-danger p-2"
						onClick={handleLeaveGroup}
					>
						Leave
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DashboardGroupLeaveModal;
