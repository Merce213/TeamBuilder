import { fetchWithRefreshAndRetry } from "../config/fetch";
import keys from "../utils/keys";

export const createInvitationGroup = async (
	groupId: string,
	emails: string[]
) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/invitations/groups/${groupId}/invite`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ emails }),
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(errorData.error || "Failed to invite group");
		}
	}

	return await response.json();
};

export const acceptInvitationGroup = async (token: string) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/invitations/groups/accept?token=${token}`,
		{
			method: "GET",
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(errorData.error || "Failed to accept invitation");
		}
	}

	return await response.json();
};
