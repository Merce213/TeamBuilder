import { NavLink, Outlet } from "react-router-dom";
import CoreContainer from "../../../components/CoreContainer";

const Settings = () => {
	return (
		<CoreContainer className="h-screen-navbar flex flex-col items-center justify-center">
			<div className="bg-secondary-dark-6 w-full max-w-screen-lg flex p-4 gap-4 s-md:gap-8 rounded-lg shadow-md">
				<div className="flex flex-col">
					<NavLink
						to="profile"
						className={({ isActive }) =>
							`p-2 font-semibold ${
								isActive
									? "text-accent-light-3"
									: "hover:text-accent-light-3"
							}`
						}
					>
						Profile
					</NavLink>
					<NavLink
						to="account"
						className={({ isActive }) =>
							`p-2 font-semibold ${
								isActive
									? "text-accent-light-3"
									: "hover:text-accent-light-3"
							}`
						}
					>
						Account
					</NavLink>
					<NavLink
						to="groups"
						className={({ isActive }) =>
							`p-2 font-semibold ${
								isActive
									? "text-accent-light-3"
									: "hover:text-accent-light-3"
							}`
						}
					>
						Groups
					</NavLink>
					<NavLink
						to="teams"
						className={({ isActive }) =>
							`p-2 font-semibold ${
								isActive
									? "text-accent-light-3"
									: "hover:text-accent-light-3"
							}`
						}
					>
						Teams
					</NavLink>
				</div>

				<div className="flex flex-col gap-4 w-full">
					<Outlet />
				</div>
			</div>
		</CoreContainer>
	);
};

export default Settings;
