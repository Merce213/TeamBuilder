import {
	fetchWithRefreshAndRetry,
	fetchWithRefreshOnly,
} from "../config/fetch";
import keys from "../utils/keys";

export const checkAuth = async () => {
	const response = await fetchWithRefreshAndRetry(`${keys.API_URL}/auth/me`);

	return response;
};

export const signUp = async (data: {
	username: string;
	email: string;
	password: string;
}) => {
	const response = await fetchWithRefreshOnly(`${keys.API_URL}/auth/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	return response;
};

export const signIn = async (data: { username: string; password: string }) => {
	const response = await fetchWithRefreshOnly(`${keys.API_URL}/auth/signin`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	return response;
};

export const signOut = async () => {
	const response = await fetchWithRefreshAndRetry(
		`${keys.API_URL}/auth/signout`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		}
	);

	return response;
};
