import { Outlet } from "react-router-dom";
import Navbar from "../Header/Navbar";

const Layout = () => {
	return (
		<>
			<Navbar />
			<main>
				<Outlet />
			</main>
		</>
	);
};

export default Layout;
