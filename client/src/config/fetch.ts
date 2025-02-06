import keys from "../utils/keys";

export const refreshTokens = async () => {
	const refreshResponse = await fetch(`${keys.API_URL}/auth/refresh_token`, {
		method: "POST",
		credentials: "include",
	});

	if (!refreshResponse.ok) {
		throw new Error("Session expired. Please login again.");
	}
};

export const fetchWithRefreshAndRetry = async (
	url: string,
	options: RequestInit = {}
) => {
	let response;

	response = await fetch(url, {
		...options,
		credentials: "include",
	});

	if (response.status === 401) {
		try {
			await refreshTokens();
			response = await fetch(url, {
				...options,
				credentials: "include",
			});
		} catch (error) {
			console.error("Refresh error:", error);
			throw new Error("Session expired. Please login again.");
		}
	}

	return response;
};

export const fetchWithRefreshOnly = async (
	url: string,
	options: RequestInit = {}
) => {
	const response = await fetch(url, {
		...options,
		credentials: "include",
	});

	if (response.status === 401) {
		try {
			await refreshTokens();
		} catch (error) {
			console.error("Refresh error:", error);
			throw new Error("Session expired. Please login again.");
		}
	}

	return response;
};
