import CoreContainer from "../components/CoreContainer";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
	const { user } = useAuth();

	return (
		<CoreContainer className="h-screen-navbar">
			<div>
				<h1>Profile</h1>
				<p>Username: {user?.username}</p>
				<p>Email: {user?.email}</p>
				<p>Role: {user?.role}</p>
			</div>
		</CoreContainer>
	);
};

export default Profile;
