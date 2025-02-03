import { GroupMembershipExtraInfo } from "../../../types/Group";
import { ReactSetState } from "../../../types/ReactTypes";
import Modal from "../../Modal";

const DashboardGroupRemoveMemberModal = ({
	openModalRemoveMemberGroup,
	setOpenModalRemoveMemberGroup,
	selectedMember,
}: {
	openModalRemoveMemberGroup: boolean;
	setOpenModalRemoveMemberGroup: ReactSetState<boolean>;
	selectedMember: GroupMembershipExtraInfo | null;
}) => {
	return (
		<Modal
			isOpen={openModalRemoveMemberGroup}
			onClose={() => setOpenModalRemoveMemberGroup(false)}
			closeOnClickOutside={true}
		>
			<div id="modal-content" className="flex flex-col gap-5">
				<p className="text-base font-semibold font-sora">
					Remove member from group
				</p>
				<p className="text-sm">
					Are you sure you want to remove {selectedMember?.username}{" "}
					from the group?
				</p>
				<div className="flex gap-4 justify-end">
					<button
						className="btn-danger-outline p-2"
						onClick={() => setOpenModalRemoveMemberGroup(false)}
					>
						Cancel
					</button>
					<button
						className="btn-danger p-2"
						onClick={() => {
							//TODO: implement remove member from group
							setOpenModalRemoveMemberGroup(false);
						}}
					>
						Remove
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DashboardGroupRemoveMemberModal;
