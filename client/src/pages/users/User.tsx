import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWithRefreshAndRetry } from "../../config/fetch";
import keys from "../../utils/keys";

const User = () => {
	const { userId } = useParams();
	const [user, setUser] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetchWithRefreshAndRetry(
					`${keys.API_URL}/users/${userId}`
				);
				const data = await response.json();
				setUser(data);
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, [userId]);

	const handleSubmit = async () => {
		try {
			const response = await fetchWithRefreshAndRetry(
				`${keys.API_URL}/users/${userId}`
			);
			const data = await response.json();
			setUser(data);
		} catch (error) {
			console.error("Error fetching user:", error);
		} finally {
			setLoading(false);
		}
	};

	if (!user) {
		return <div>User not found</div>;
	}

	return (
		<div className="py-4 px-5 container mt-16 h-navbar">
			<div className="bg-secondary-dark-6">
				<div>
					<h1>{user.username}'s Profile</h1>
				</div>
			</div>
		</div>
	);
};

export default User;
