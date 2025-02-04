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
