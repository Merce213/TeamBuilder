import { NavLink, Outlet } from "react-router-dom";
import { UserRole } from "../../types/User";

export const BtnUserRole = ({ role }: { role: UserRole }) => {
	switch (role) {
		case UserRole.ADMIN:
			return (
				<span className="font-semibold uppercase p-1 bg-danger-dark-3 rounded-sm">
					Admin
				</span>
			);
		case UserRole.USER:
			return (
				<span className="font-semibold uppercase p-1 bg-accent rounded-sm">
					User
				</span>
			);
		default:
			return <span>Unknown</span>;
	}
};

const AdminMain = () => {
	return (
		<div className="p-4 h-screen-navbar mt-16 bg-secondary-dark-7">
			<div className="bg-secondary-dark-6 w-full max-w-screen-lg mx-auto flex flex-col gap-4 p-4 rounded-lg shadow-md">
				<nav className="flex flex-wrap gap-4 s-md:gap-8">
					<NavLink
						to="/admin/users"
						className={({ isActive }) =>
							`px-4 py-2 rounded-md transition-colors ${
								isActive
									? "bg-primary text-white"
									: "bg-secondary-dark-5 hover:bg-secondary-dark-4"
							}`
						}
					>
						Users
					</NavLink>
					<NavLink
						to="/admin/groups"
						className={({ isActive }) =>
							`px-4 py-2 rounded-md transition-colors ${
								isActive
									? "bg-primary text-white"
									: "bg-secondary-dark-5 hover:bg-secondary-dark-4"
							}`
						}
					>
						Groups
					</NavLink>
					<NavLink
						to="/admin/teams"
						className={({ isActive }) =>
							`px-4 py-2 rounded-md transition-colors ${
								isActive
									? "bg-primary text-white"
									: "bg-secondary-dark-5 hover:bg-secondary-dark-4"
							}`
						}
					>
						Teams
					</NavLink>
				</nav>

				<div className="bg-secondary-dark-5 p-4 rounded-lg">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AdminMain;
