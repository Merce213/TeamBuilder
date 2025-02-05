import { fetchWithRefreshAndRetry } from "../config/fetch";
import { TeamBody } from "../types/Team";
import keys from "../utils/keys";

export const createTeam = async (
	userId: string,
	groupId: string,
	data: TeamBody
) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/groups/${groupId}/teams`,
		{
			method: "POST",
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
			throw new Error(errorData.error || "Failed to create team");
		}
	}

	return await response.json();
};

export const getTeamsByGroupId = async (userId: string, groupId: string) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/groups/${groupId}/teams`
	);

	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(errorData.error || "Failed to fetch teams");
		}
	}

	return await response.json();
};

export const getTeam = async (
	userId: string,
	groupId: string,
	teamId: string
) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/groups/${groupId}/teams/${teamId}`
	);

	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(errorData.error || "Failed to fetch team");
		}
	}

	return await response.json();
};

export const updateTeam = async (
	userId: string,
	groupId: string,
	teamId: string,
	data: TeamBody
) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/groups/${groupId}/teams/${teamId}`,
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
			throw new Error(errorData.error || "Failed to update team");
		}
	}

	return await response.json();
};

export const deleteTeam = async (
	userId: string,
	groupId: string,
	teamId: string
) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/groups/${groupId}/teams/${teamId}`,
		{
			method: "DELETE",
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(errorData.error || "Failed to delete team");
		}
	}

	return await response.json();
};
