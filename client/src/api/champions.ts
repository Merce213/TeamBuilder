import keys from "../utils/keys";

export const getChampions = async () => {
	const response = await fetch(`${keys.API_URL}/champions`);

	return response;
};
