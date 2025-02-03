import { fetchWithRefreshAndRetry } from "../config/fetch";
import {
	ResponseFavoriteChampions,
	ResponseFavoriteLanes,
	ResponseSummonerProfile,
} from "../types/Summoner";
import keys from "../utils/keys";

export const linkSummonerToUser = async (
	userId: string,
	summonerName: string
) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/summoners/${userId}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ summonerName }),
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to link summoner");
	}

	return await response.json();
};

export const unlinkSummonerFromUser = async (userId: string) => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/summoners/${userId}`,
		{
			method: "DELETE",
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to unlink summoner");
	}

	return await response.json();
};

export const getSummonerProfile = async (
	userId: string
): Promise<ResponseSummonerProfile> => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/summoners/${userId}`
	);

	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(errorData.error || "Failed to fetch summoner");
		}
	}

	return await response.json();
};

export const getFavoriteLanes = async (
	userId: string
): Promise<ResponseFavoriteLanes> => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/favorite-lanes`
	);

	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(
				errorData.error || "Failed to fetch favorite lanes"
			);
		}
	}

	return await response.json();
};

export const getFavoriteChampions = async (
	userId: string
): Promise<ResponseFavoriteChampions> => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/users/${userId}/favorite-champions`
	);

	if (!response.ok) {
		const errorData = await response.json();
		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(
				errorData.error || "Failed to fetch favorite champions"
			);
		}
	}

	return await response.json();
};
