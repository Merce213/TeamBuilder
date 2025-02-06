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

export const sendPasswordResetLink = async (email: string) => {
	const response = await fetch(`${keys.API_URL}/auth/reset-password-link`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email }),
	});

	if (!response.ok) {
		const errorData = await response.json();

		if (errorData.errors) {
			throw errorData.errors;
		} else {
			throw new Error(
				errorData.error || "Failed to send password reset link"
			);
		}
	}

	return await response.json();
};

export const resetPassword = async (data: {
	token: string;
	newPassword: string;
}) => {
	const response = await fetch(
		`${keys.API_URL}/auth/change-forgotten-password`,
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
			throw new Error("Failed to reset password");
		}
	}

	return await response.json();
};
