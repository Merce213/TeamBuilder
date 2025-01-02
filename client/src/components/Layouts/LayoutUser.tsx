import { Outlet } from "react-router-dom";
import NavbarUser from "../Header/NavbarUser";
import Sidebar from "../Header/Sidebar";

const LayoutUser = () => {
	return (
		<>
			<NavbarUser />
			<Sidebar />
			<main className="p-4 s-sm:ml-64 mt-18">
				<Outlet />
			</main>
		</>
	);
};

export default LayoutUser;
