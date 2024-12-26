import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
	const { user } = useAuth();

	return (
		<div>
			<h1>Profile</h1>
			<p>Username: {user?.username}</p>
			<p>Email: {user?.email}</p>
			<p>Role: {user?.role}</p>
		</div>
	);
};

export default Profile;
