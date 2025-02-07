import { fetchWithRefreshAndRetry } from "../config/fetch";
import { UserCreate } from "../types/User";
import keys from "../utils/keys";

// Users API
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

export const getAllUsers = async () => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/all`
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to fetch users");
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

// Favorite Champions API
export const getFavoriteLanes = async (userId: string) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/favorite-lanes`
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to fetch favorite lanes");
	}

	return await response.json();
};

export const updateFavoriteLanes = async (
	userId: string,
	data: { lanes: string[] }
) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/favorite-lanes`,
		{
			method: "PUT",
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
			throw new Error(
				errorData.error || "Failed to update favorite lanes"
			);
		}
	}

	return await response.json();
};

export const updateFavoriteChampions = async (
	userId: string,
	data: { champions: string[] }
) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/favorite-champions`,
		{
			method: "PUT",
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
			throw new Error(
				errorData.error || "Failed to update favorite champions"
			);
		}
	}

	return await response.json();
};
