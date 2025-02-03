import { useState } from "react";
import { ReactSetState } from "../../../types/ReactTypes";
import Modal from "../../Modal";
import { X } from "lucide-react";

const DashboardGroupInvitationModal = ({
	openModalInvitationGroup,
	setOpenModalInvitationGroup,
}: {
	openModalInvitationGroup: boolean;
	setOpenModalInvitationGroup: ReactSetState<boolean>;
}) => {
	const [inviteInput, setInviteInput] = useState("");
	const [invitedMembers, setInvitedMembers] = useState<string[]>([]);

	const handleInvite = () => {
		if (inviteInput && !invitedMembers.includes(inviteInput)) {
			setInvitedMembers([...invitedMembers, inviteInput]);
			setInviteInput("");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			handleInvite();
		}
	};

	const removeInvitedMember = (member: string) => {
		setInvitedMembers(invitedMembers.filter((m) => m !== member));
	};

	return (
		<Modal
			isOpen={openModalInvitationGroup}
			onClose={() => setOpenModalInvitationGroup(false)}
			closeOnClickOutside={true}
		>
			<div id="modal-content" className="flex flex-col gap-5">
				<div className="flex flex-col gap-2">
					<p className="text-sm s-sm:text-lg font-semibold">
						Members
					</p>
					<div className="flex flex-col gap-2">
						<div>
							<p className="font-semibold">Invite Members</p>
							<p className="text-sm text-gray-light-7">
								Invite members by username or email
							</p>
						</div>
						<div className="flex gap-2">
							<input
								type="text"
								className="p-1 border border-accent rounded flex-grow s-md:text-base s-md:px-2 s-md:py-1"
								placeholder="Username or Email"
								value={inviteInput}
								onChange={(e) =>
									setInviteInput(e.target.value.trim())
								}
								onKeyDown={handleKeyPress}
							/>
							<button
								className="btn-primary p-2"
								onClick={handleInvite}
							>
								Add
							</button>
						</div>
						<div className="flex flex-wrap gap-2 mt-2">
							{invitedMembers.map((member, index) => (
								<div
									key={index}
									className="flex items-center bg-secondary-dark-7 rounded-full px-3 py-1"
								>
									<span className="text-sm">{member}</span>
									<div
										className="ml-2 p-1 bg-danger-dark-1 rounded-full cursor-pointer hover:bg-danger-dark-3 transition-all"
										onClick={() =>
											removeInvitedMember(member)
										}
									>
										<X size={14} />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="flex gap-4">
					<button
						className="btn-danger-outline flex-1 p-1"
						onClick={() => setOpenModalInvitationGroup(false)}
					>
						Cancel
					</button>
					<button className="btn-primary-outline flex-1 p-1">
						Invite
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DashboardGroupInvitationModal;
