import { Pencil, Trash2 } from "lucide-react";
import { BtnUserRole } from "../../../pages/admin/AdminMain";
import { ReactSetState } from "../../../types/ReactTypes";
import { User, UserRole } from "../../../types/User";
import DataTable, { Column } from "../../DataTable";

interface AdminUsersTableProps {
	usersData: User[];
	isAuthorizedActions: (role: UserRole) => boolean;
	setSelectedUser: ReactSetState<User | null>;
	setOpenModalEditUser: ReactSetState<boolean>;
	setOpenModalDeleteUser: ReactSetState<boolean>;
}

const AdminUsersTable = ({
	usersData,
	isAuthorizedActions,
	setSelectedUser,
	setOpenModalEditUser,
	setOpenModalDeleteUser,
}: AdminUsersTableProps) => {
	const columns: Column<User>[] = [
		{
			key: "username",
			header: "Username",
		},
		{
			key: "email",
			header: "Email",
		},
		{
			key: "role",
			header: "Role",
		},
		{
			key: "createdAt",
			header: "Created At",
		},
		{
			key: "actions",
			header: "Actions",
		},
	] as Column<User>[];

	const renderCell = (key: keyof User | "actions", user: User) => {
		switch (key) {
			case "username":
				return user.username;
			case "email":
				return user.email;
			case "role":
				return <BtnUserRole role={user.role} />;
			case "createdAt":
				return new Date(user.createdAt).toLocaleString();
			case "actions":
				return (
					isAuthorizedActions(user.role) && (
						<div className="flex gap-2">
							<Pencil
								size={30}
								className="p-1 bg-primary-dark-1 rounded cursor-pointer hover:bg-primary-dark-3 transition-all"
								onClick={(e) => {
									e.stopPropagation();
									setSelectedUser(user);
									setOpenModalEditUser(true);
								}}
							/>

							<Trash2
								size={30}
								className="p-1 bg-danger-dark-1 rounded cursor-pointer hover:bg-danger-dark-3 transition-all"
								onClick={(e) => {
									e.stopPropagation();
									setSelectedUser(user);
									setOpenModalDeleteUser(true);
								}}
							/>
						</div>
					)
				);
			default:
				return "N/A";
		}
	};
	return (
		<DataTable columns={columns} data={usersData} renderCell={renderCell} />
	);
};

export default AdminUsersTable;
