import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/Teambuilder.png";
import { useLayout } from "../../contexts/LayoutContext";
import UserMenu from "./UserMenu";

const NavbarUser = () => {
	const { isSidebarOpen, setSidebarOpen } = useLayout();

	const handleOpenSidebar = () => {
		setSidebarOpen(!isSidebarOpen);
	};

	return (
		<header className="header bg-gray border-b border-gray-light-3">
			<nav className="px-3 lg:px-5 lg:pl-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center justify-start gap-3">
						<button
							type="button"
							className="items-center p-1 text-sm rounded-lg s-md:hidden btn-accent-outline"
							onClick={handleOpenSidebar}
							aria-expanded={isSidebarOpen}
							aria-controls="sidebar"
						>
							<Menu />
						</button>
						<Link to="/">
							<img
								src={logo}
								className="w-16 h-16"
								alt="TeamBuilder Logo"
							/>
						</Link>
					</div>
					<div className="flex items-center py-2">
						<UserMenu className="hover:bg-gray-light-1" />
					</div>
				</div>
			</nav>
		</header>
	);
};

export default NavbarUser;
