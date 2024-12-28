import { useState } from "react";
import { NavLink } from "react-router-dom";
import { signOut } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
	const [error, setError] = useState<string>("");
	const handleSignOut = async () => {
		try {
			const response = await signOut();
			if (!response.ok) {
				const errorData = await response.json();
				setError("Error signing out. Please try again.");
				return;
			}

			// toast.success("Signed out successfully");
			setUser(null);
			setError("");
		} catch (error) {
			console.error("Error:", error);
			// toast.error("Error signing out");
			setError("Error signing out");
		}
	};

	const { user, setUser } = useAuth();
	return (
		<nav>
			<ul>
				<li>
					<NavLink to="/">Home</NavLink>
				</li>
				<li>
					<NavLink to="/profile">Profile</NavLink>
				</li>
				<li>
					<NavLink to="/signin">Sign In</NavLink>
				</li>
			</ul>
			{user && <p>{user.username}</p>}
			{user && <button onClick={handleSignOut}>Sign Out</button>}
			{error && <p>{error}</p>}
		</nav>
	);
};

export default Navbar;
