import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { getUser, updateUser } from "../../../api/user";
import DeleteAccountModal from "../../../components/Settings/DeleteAccountModal";
import { useAuth } from "../../../contexts/AuthContext";

const AccountSetting = () => {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [openModalDeleteAccount, setOpenModalDeleteAccount] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["user", user?.id],
		queryFn: () => getUser(user?.id ?? ""),
		staleTime: 1000 * 60 * 5,
		enabled: !!user,
	});

	const [userData, setUserData] = useState({
		username: "",
		email: "",
		oldPassword: "",
		newPassword: "",
	});

	const updateUserMutation = useMutation({
		mutationFn: (updatedUserData: Partial<typeof userData>) =>
			updateUser(user?.id ?? "", updatedUserData),
		onSuccess: async (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
			toast.success("User information updated successfully", {
				style: {
					padding: "16px",
				},
			});

			if ("oldPassword" in variables || "newPassword" in variables) {
				setUserData((prevState) => ({
					...prevState,
					oldPassword: "",
					newPassword: "",
				}));
			}
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
			return;
		},
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

	const isFieldChanged = (field: keyof typeof userData) => {
		if (!data) return false;
		return userData[field] !== "" && userData[field] !== data[field];
	};

	const handleSave = () => {
		const updatedFields = Object.entries(userData).reduce(
			(acc, [key, value]) => {
				if (value !== "" && value !== data[key as keyof typeof data]) {
					acc[key as keyof typeof userData] = value;
				}
				return acc;
			},
			{} as Partial<typeof userData>
		);

		if (Object.keys(updatedFields).length > 0) {
			updateUserMutation.mutate(updatedFields);
		}
	};

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error: {error.message}</p>;

	return (
		<>
			<div className="w-full flex flex-col gap-4">
				<div>
					<label htmlFor="username" className="">
						Username
					</label>
					<input
						id="username"
						type="text"
						name="username"
						value={userData.username || data.username}
						onChange={handleInputChange}
						className="mt-1 block w-full px-3 py-1 border-2 rounded-md shadow-sm"
					/>
					{errors.username && (
						<p className="text-danger-light-3 text-sm mt-2">
							{errors.username}
						</p>
					)}
					{isFieldChanged("username") && (
						<button
							onClick={handleSave}
							className="mt-2 btn-accent p-2"
							disabled={updateUserMutation.isPending}
						>
							{updateUserMutation.isPending
								? "Saving..."
								: "Save Username"}
						</button>
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
						value={userData.email || data.email}
						onChange={handleInputChange}
						className="mt-1 block w-full px-3 py-1 border-2 rounded-md shadow-sm"
					/>
					{errors.email && (
						<p className="text-danger-light-3 text-sm mt-2">
							{errors.email}
						</p>
					)}
					{isFieldChanged("email") && (
						<button
							onClick={handleSave}
							className="mt-2 btn-accent p-2"
							disabled={updateUserMutation.isPending}
						>
							{updateUserMutation.isPending
								? "Saving..."
								: "Save Email"}
						</button>
					)}
				</div>

				<div>
					<label htmlFor="password" className="">
						Change password
					</label>

					<div className="flex flex-col gap-2">
						<input
							id="oldPassword"
							type="password"
							name="oldPassword"
							value={userData.oldPassword}
							placeholder="Old Password"
							onChange={handleInputChange}
							className="mt-1 block w-full px-3 py-1 border-2 rounded-md shadow-sm"
						/>
						<input
							id="newPassword"
							type="password"
							name="newPassword"
							value={userData.newPassword}
							placeholder="New Password"
							onChange={handleInputChange}
							className="mt-1 block w-full px-3 py-1 border-2 rounded-md shadow-sm"
						/>
						{errors.newPassword && (
							<p className="text-danger-light-3 text-sm mt-2">
								{errors.newPassword}
							</p>
						)}
						{userData.oldPassword && userData.newPassword && (
							<button
								onClick={handleSave}
								className="mt-2 btn-accent p-2"
								disabled={updateUserMutation.isPending}
							>
								{updateUserMutation.isPending
									? "Saving..."
									: "Save New Password"}
							</button>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-2 mt-4">
					<p className="text-gray-light-6 text-sm">
						Warning! This will permanently delete all your account
						data.
					</p>
					<div>
						<button
							type="button"
							className="btn-danger p-2"
							onClick={() => setOpenModalDeleteAccount(true)}
						>
							Delete User Account
						</button>
					</div>
				</div>
			</div>

			{openModalDeleteAccount && (
				<DeleteAccountModal
					openModalDeleteAccount={openModalDeleteAccount}
					setOpenModalDeleteAccount={setOpenModalDeleteAccount}
				/>
			)}
		</>
	);
};

export default AccountSetting;
