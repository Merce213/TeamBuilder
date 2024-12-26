import clientFetch from "../config/axios";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
	const logout = async () => {
		await clientFetch.post("/auth/signout");
		setUser(null);
	};

	const { user, setUser } = useAuth();
	console.log("user", user);
	return (
		<nav>
			<ul>
				<li>
					<a href="/">Home</a>
				</li>
				<li>
					<a href="profile">Profile</a>
				</li>
				<li>
					<a href="/signin">Sign In</a>
				</li>
			</ul>
			{user && <p>{user.username}</p>}
			{user && <button onClick={logout}>Sign Out</button>}
		</nav>
	);
};

export default Navbar;
