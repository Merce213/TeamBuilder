import { Outlet } from "react-router-dom";
import NavbarUser from "../Header/NavbarUser";
import Sidebar from "../Header/Sidebar";

const LayoutUser = () => {
	return (
		<>
			<NavbarUser />
			<Sidebar />
			<main>
				<Outlet />
			</main>
		</>
	);
};

export default LayoutUser;
