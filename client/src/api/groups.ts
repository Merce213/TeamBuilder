import { fetchWithRefreshAndRetry } from "../config/fetch";
import { GroupBody, ResponseGroup } from "../types/Group";
import keys from "../utils/keys";

export const getGroups = async (userId: string) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/groups`
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to fetch all groups");
	}

	return await response.json();
};

export const getGroup = async (
	userId: string,
	groupId: string
): Promise<ResponseGroup> => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/groups/${groupId}`
	);
	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(errorData.error || "Failed to fetch group");
		}
	}

	return await response.json();
};

export const createGroup = async (userId: string, data: GroupBody) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/groups`,
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
			throw new Error(errorData.error || "Failed to create group");
		}
	}

	return await response.json();
};

export const updateGroup = async (
	userId: string,
	groupId: string,
	data: Partial<GroupBody>
) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/groups/${groupId}`,
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
			throw new Error(errorData.error || "Failed to update group");
		}
	}

	return await response.json();
};

export const deleteGroup = async (userId: string, groupId: string) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/groups/${groupId}`,
		{
			method: "DELETE",
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(errorData.error || "Failed to delete group");
		}
	}

	return await response.json();
};

export const kickMemberFromGroup = async (
	userId: string,
	groupId: string,
	memberId: string
) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/groups/${groupId}/members/${memberId}`,
		{
			method: "DELETE",
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(errorData.error || "Failed to kick member");
		}
	}

	return await response.json();
};

export const leaveGroup = async (userId: string, groupId: string) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/groups/${groupId}/leave`,
		{
			method: "DELETE",
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(errorData.error || "Failed to leave group");
		}
	}

	return await response.json();
};
