import axios from "axios";

const clientFetch = axios.create({
	baseURL: "http://localhost:3001/api",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

clientFetch.interceptors.response.use(
	(response) => {
		if (response.status === 401) {
			window.location.pathname = "/sign-in";
			return Promise.reject("Unauthorized");
		}
		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default clientFetch;
