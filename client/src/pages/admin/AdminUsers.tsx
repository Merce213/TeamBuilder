import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllUsers } from "../../api/user";
import AdminUsersDeleteModal from "../../components/Admin/Users/AdminUsersDeleteModal";
import AdminUsersTable from "../../components/Admin/Users/AdminUsersTable";
import { User, UserRole } from "../../types/User";
import AdminUsersEditModal from "../../components/Admin/Users/AdminUsersEditModal";

const AdminUsers = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [openModalEditUser, setOpenModalEditUser] = useState(false);
	const [openModalDeleteUser, setOpenModalDeleteUser] = useState(false);

	const {
		data: users,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["users"],
		queryFn: async () => await getAllUsers(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});

	const isAuthorized = (userRole: UserRole) => {
		if (userRole !== UserRole.ADMIN) {
			return true;
		}
		return false;
	};

	const filteredUsers: User[] = users?.filter(
		(user: User) =>
			user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<>
			<div className="space-y-4">
				<div className="flex flex-col gap-2 s-md:flex-row justify-between items-center">
					<h1 className="text-2xl font-bold">User Management</h1>
					<div className="">
						<input
							type="text"
							placeholder="Search for a user..."
							className="px-4 py-2 bg-secondary-dark-4 rounded-md border border-text text-text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{isLoading ? (
					<div className="text-center py-8">Loading...</div>
				) : isError ? (
					<div className="text-center py-8">
						Error:{" "}
						{error instanceof Error
							? "No users exist yet"
							: "An unexpected error occurred"}
					</div>
				) : (
					<div
						id="users-list"
						aria-label="users-list"
						className="w-full overflow-x-auto overflow-y-auto"
					>
						<AdminUsersTable
							usersData={filteredUsers}
							isAuthorizedActions={isAuthorized}
							setSelectedUser={setSelectedUser}
							setOpenModalEditUser={setOpenModalEditUser}
							setOpenModalDeleteUser={setOpenModalDeleteUser}
						/>
					</div>
				)}
			</div>

			{openModalDeleteUser && (
				<AdminUsersDeleteModal
					openModalDeleteUser={openModalDeleteUser}
					setOpenModalDeleteUser={setOpenModalDeleteUser}
					selectedUser={selectedUser}
				/>
			)}

			{openModalEditUser && (
				<AdminUsersEditModal
					openModalEditUser={openModalEditUser}
					setOpenModalEditUser={setOpenModalEditUser}
					selectedUser={selectedUser}
				/>
			)}
		</>
	);
};

export default AdminUsers;
