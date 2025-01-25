import { fetchWithRefreshAndRetry } from "../config/fetch";
import { UserCreate } from "../types/User";
import keys from "../utils/keys";

export const getUser = async (userId: string) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}`
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to fetch user");
	}

	return await response.json();
};

export const updateUser = async (userId: string, data: Partial<UserCreate>) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}`,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(errorData.error || "Failed to update user");
		}
	}

	return await response.json();
};

export const deleteUser = async (userId: string) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}`,
		{
			method: "DELETE",
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to delete user");
	}

	return await response.json();
};
