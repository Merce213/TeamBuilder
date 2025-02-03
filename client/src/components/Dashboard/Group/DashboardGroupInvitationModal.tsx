import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createInvitationGroup } from "../../../api/invitation";
import { useGroup } from "../../../contexts/GroupContext";
import { ReactSetState } from "../../../types/ReactTypes";
import Modal from "../../Modal";

const DashboardGroupInvitationModal = ({
	openModalInvitationGroup,
	setOpenModalInvitationGroup,
}: {
	openModalInvitationGroup: boolean;
	setOpenModalInvitationGroup: ReactSetState<boolean>;
}) => {
	const { selectedGroupId } = useGroup();

	const [inviteInput, setInviteInput] = useState("");
	const [invitedMembers, setInvitedMembers] = useState<string[]>([]);

	const [errors, setErrors] = useState<Record<string, string>>({});

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

	const createInvitationGroupMutation = useMutation({
		mutationFn: async () => {
			return createInvitationGroup(selectedGroupId!, invitedMembers);
		},
		onSuccess: () => {
			setOpenModalInvitationGroup(false);
		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(`Failed to invite members: ${error.message}`, {
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
			isOpen={openModalInvitationGroup}
			onClose={() => setOpenModalInvitationGroup(false)}
			closeOnClickOutside={true}
		>
			<div id="modal-content" className="flex flex-col gap-5">
				<div className="flex flex-col gap-2">
					<p className="text-sm s-sm:text-lg font-semibold">
						Invite Members
					</p>
					<div className="flex flex-col gap-2">
						<div>
							<p className="text-sm text-gray-light-7">
								Invite members by email, press "Enter" or "," to
								add an email to the list.
							</p>
						</div>
						<div className="flex gap-2">
							<input
								type="text"
								className="p-1 border border-accent rounded flex-grow s-md:text-base s-md:px-2 s-md:py-1"
								placeholder="Email"
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

						<div className="flex flex-col gap-2 mt-2">
							{!invitedMembers.length ? (
								<p className="text-sm text-gray-light-7">
									No members invited yet
								</p>
							) : (
								<p>List of invited members:</p>
							)}
							{errors.emails && (
								<p className="text-sm text-danger-dark-1">
									{errors.emails}
								</p>
							)}
							<div className="flex flex-wrap gap-2">
								{invitedMembers.map((member, index) => (
									<div
										key={index}
										className="flex items-center bg-secondary-dark-7 rounded-full px-3 py-1"
									>
										<span className="text-sm">
											{member}
										</span>
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
				</div>

				<div className="flex gap-4">
					<button
						className="btn-danger-outline flex-1 p-1"
						onClick={() => setOpenModalInvitationGroup(false)}
					>
						Cancel
					</button>
					<button
						className="btn-primary flex-1 p-1"
						onClick={() => createInvitationGroupMutation.mutate()}
						disabled={
							createInvitationGroupMutation.isPending ||
							!invitedMembers.length
						}
					>
						Invite
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DashboardGroupInvitationModal;
