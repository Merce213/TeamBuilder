import { toast } from "sonner";
import { signOut } from "../../api/auth";
import { deleteUser } from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";
import { ReactSetState } from "../../types/ReactTypes";
import Modal from "../Modal";

const DeleteAccountModal = ({
	openModalDeleteAccount,
	setOpenModalDeleteAccount,
}: {
	openModalDeleteAccount: boolean;
	setOpenModalDeleteAccount: ReactSetState<boolean>;
}) => {
	const { user } = useAuth();

	const handleDeleteAccount = async () => {
		try {
			if (!user) return;
			await Promise.all([deleteUser(user.id), signOut()]);
			setOpenModalDeleteAccount(false);

			window.location.href = "/";
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "An unknown error occurred",
				{
					style: {
						padding: "16px",
					},
				}
			);
		}
	};

	return (
		<Modal
			isOpen={openModalDeleteAccount}
			onClose={() => setOpenModalDeleteAccount(false)}
			closeOnClickOutside={true}
		>
			<div className="flex flex-col gap-4">
				<p>Are you sure you want to delete your account?</p>
				<p>This action cannot be undone.</p>

				<div className="w-full flex gap-4">
					<button
						className="btn-danger-outline flex-1 p-2"
						onClick={() => setOpenModalDeleteAccount(false)}
					>
						Cancel
					</button>
					<button
						className="btn-danger flex-1 p-2"
						onClick={handleDeleteAccount}
					>
						Delete
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DeleteAccountModal;
