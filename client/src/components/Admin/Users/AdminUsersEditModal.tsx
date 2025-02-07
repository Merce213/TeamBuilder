import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { updateUser } from "../../../api/user";
import { ReactSetState } from "../../../types/ReactTypes";
import { User, UserRole } from "../../../types/User";
import Modal from "../../Modal";

const AdminUsersEditModal = ({
	selectedUser,
	openModalEditUser,
	setOpenModalEditUser,
}: {
	selectedUser: User | null;
	openModalEditUser: boolean;
	setOpenModalEditUser: ReactSetState<boolean>;
}) => {
	const [userData, setUserData] = useState({
		username: selectedUser?.username ?? "",
		email: selectedUser?.email ?? "",
		role: selectedUser?.role ?? UserRole.USER,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const queryClient = useQueryClient();

	const updateUserMutation = useMutation({
		mutationFn: async (updatedUserData: Partial<typeof userData>) => {
			if (selectedUser?.id) {
				return await updateUser(selectedUser.id, updatedUserData);
			}
			throw new Error("User ID is undefined");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			setOpenModalEditUser(false);
			toast.success("User updated successfully", {
				style: {
					padding: "16px",
				},
				position: "top-right",
			});
		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(
					`Failed to update user information: ${error.message}`,
					{
						style: {
							padding: "16px",
						},
					}
				);
				return;
			}
			setErrors(error);
		},
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setUserData((prevState) => ({
			...prevState,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prevErrors) => {
				const newErrors = { ...prevErrors };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const hasChanges = useMemo(() => {
		return (
			userData.username !== selectedUser?.username ||
			userData.email !== selectedUser?.email ||
			userData.role !== selectedUser?.role
		);
	}, [userData, selectedUser]);

	const getUpdatedFields = useCallback(() => {
		const updatedFields: Partial<typeof userData> = {};
		if (userData.username !== selectedUser?.username)
			updatedFields.username = userData.username;
		if (userData.email !== selectedUser?.email)
			updatedFields.email = userData.email;
		if (userData.role !== selectedUser?.role)
			updatedFields.role = userData.role;
		return updatedFields;
	}, [userData, selectedUser]);

	const handleSave = () => {
		if (hasChanges) {
			const updatedFields = getUpdatedFields();
			updateUserMutation.mutate(updatedFields);
		} else {
			toast.info("No changes to save", {
				style: { padding: "16px" },
				position: "top-right",
			});
		}
	};

	return (
		<Modal
			isOpen={openModalEditUser}
			onClose={() => setOpenModalEditUser(false)}
			closeOnClickOutside={true}
		>
			<div id="modal-content" className="flex flex-col gap-5">
				<div className="flex flex-col gap-4">
					<p className="text-base font-semibold font-sora s-sm:text-lg">
						Edit User
					</p>
				</div>
				<div className="w-full flex flex-col gap-4">
					<div>
						<label htmlFor="username" className="">
							Username
						</label>
						<input
							id="username"
							type="text"
							name="username"
							value={userData.username}
							onChange={handleInputChange}
							className="mt-1 block w-full px-3 py-1 border-2 rounded-md shadow-sm"
						/>
						{errors.username && (
							<p className="text-danger-light-3 text-sm mt-2">
								{errors.username}
							</p>
						)}
					</div>

					<div>
						<label htmlFor="email" className="">
							Email
						</label>
						<input
							id="email"
							type="email"
							name="email"
							value={userData.email}
							onChange={handleInputChange}
							className="mt-1 block w-full px-3 py-1 border-2 rounded-md shadow-sm"
						/>
						{errors.email && (
							<p className="text-danger-light-3 text-sm mt-2">
								{errors.email}
							</p>
						)}
					</div>

					<div>
						<label htmlFor="role" className="">
							Rôle
						</label>
						<select
							id="role"
							name="role"
							value={userData.role}
							onChange={handleInputChange}
							className="mt-1 block w-full px-3 py-1 border-2 rounded-md shadow-sm"
						>
							<option value={UserRole.USER}>User</option>
							<option value={UserRole.ADMIN}>
								Administrator
							</option>
						</select>
						{errors.role && (
							<p className="text-danger-light-3 text-sm mt-2">
								{errors.role}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-4">
						<button
							className="btn-primary flex-1 p-2"
							onClick={handleSave}
							disabled={
								updateUserMutation.isPending || !hasChanges
							}
						>
							{updateUserMutation.isPending
								? "Saving..."
								: "Save"}
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default AdminUsersEditModal;
