import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/Teambuilder.png";
import { useAuth } from "../../contexts/AuthContext";
import UserMenu from "./UserMenu";
import MobileMenuNavigation from "./MobileMenuNavigation";

const Navbar = () => {
	const { user } = useAuth();

	const backgroundColor = user
		? "bg-transparent hover:bg-gray-light-1"
		: "bg-primary hover:bg-primary-dark-1";

	return (
		<header className="fixed top-0 left-0 w-full bg-gray border-b border-gray-light-3">
			<nav className="px-3 container">
				<div className="flex items-center justify-between">
					<div className="flex items-center justify-start gap-3">
						<MobileMenuNavigation />
						<Link to="/">
							<img
								src={logo}
								className="w-16 h-16"
								alt="TeamBuilder Logo"
							/>
						</Link>
					</div>

					<div className="hidden s-sm:flex items-center py-2">
						<NavLink
							to="/"
							className={({ isActive }) =>
								`p-2 rounded-lg transition-all ${
									isActive
										? "text-primary"
										: "hover:text-primary"
								}`
							}
						>
							Home
						</NavLink>
						<NavLink
							to="/champions"
							className={({ isActive }) =>
								`p-2 rounded-lg transition-all ${
									isActive
										? "text-primary"
										: "hover:text-primary"
								}`
							}
						>
							Champions
						</NavLink>
					</div>

					<div className="flex items-center py-2">
						<UserMenu className={backgroundColor} />
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
