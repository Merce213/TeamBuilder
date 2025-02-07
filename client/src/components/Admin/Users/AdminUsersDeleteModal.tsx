import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteUser } from "../../../api/user";
import { ReactSetState } from "../../../types/ReactTypes";
import { User } from "../../../types/User";
import Modal from "../../Modal";

const AdminUsersDeleteModal = ({
	selectedUser,
	openModalDeleteUser,
	setOpenModalDeleteUser,
}: {
	selectedUser: User | null;
	openModalDeleteUser: boolean;
	setOpenModalDeleteUser: ReactSetState<boolean>;
}) => {
	const queryClient = useQueryClient();

	const deleteUserMutation = useMutation({
		mutationFn: async () => {
			if (selectedUser?.id) {
				return await deleteUser(selectedUser.id);
			}
			throw new Error("User ID is undefined");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			setOpenModalDeleteUser(false);
			toast.success("User deleted successfully", {
				style: {
					padding: "16px",
				},
				position: "top-right",
			});
		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(`Failed to delete user account: ${error.message}`, {
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
			isOpen={openModalDeleteUser}
			onClose={() => setOpenModalDeleteUser(false)}
			closeOnClickOutside={true}
		>
			<div id="modal-content" className="flex flex-col gap-5">
				<p className="text-base font-semibold font-sora">Delete user</p>
				<p className="text-sm">
					Are you sure you want to delete the user account with the
					username :{" "}
					<span className="font-bold font-sora">
						{selectedUser?.username}
					</span>{" "}
					? This action cannot be undone.
				</p>
				<div className="flex gap-4 justify-end">
					<button
						className="btn-danger-outline p-2"
						onClick={() => setOpenModalDeleteUser(false)}
					>
						Cancel
					</button>
					<button
						className="btn-danger p-2"
						onClick={() => deleteUserMutation.mutate()}
					>
						Delete
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default AdminUsersDeleteModal;
