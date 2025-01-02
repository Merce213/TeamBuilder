import { Outlet } from "react-router-dom";
import Navbar from "../Header/Navbar";

const Layout = () => {
	return (
		<>
			<Navbar />
			<main className="py-4 px-5 container mt-18">
				<Outlet />
			</main>
		</>
	);
};

export default Layout;
