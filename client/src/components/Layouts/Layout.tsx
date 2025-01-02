import { Outlet } from "react-router-dom";
import Navbar from "../Header/Navbar";

const Layout = () => {
	return (
		<>
			<Navbar />
			<main className="p-4 container mt-18">
				<Outlet />
			</main>
		</>
	);
};

export default Layout;
