import keys from "../utils/keys";

export const getChampions = async (queryParams: URLSearchParams) => {
	const url =
		queryParams.size >= 1
			? `${keys.API_URL}/champions?${queryParams}`
			: `${keys.API_URL}/champions`;
	const response = await fetch(url);

	if (!response.ok) {
		const errorData = await response.json();

		throw new Error(errorData.error || "Failed to fetch champions");
	}

	return await response.json();
};
