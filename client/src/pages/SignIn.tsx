import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import clientFetch from "../config/axios";

const SignIn = () => {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const navigate = useNavigate();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setCredentials((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prevErrors) => {
				const newErrors = { ...prevErrors };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		clientFetch
			.post("/auth/signin", credentials)
			.then((response) => {
				console.log("sign in response", response);
				navigate("/");
				navigate(0);
			})
			.catch((error) => {
				console.log("sign in error", error);
				if (error.response && error.response.data) {
					setErrors(error.response.data);
				}
			});
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Username:
				<input
					type="text"
					name="username"
					value={credentials.username}
					onChange={handleChange}
				/>
			</label>
			<label>
				Password:
				<input
					type="password"
					name="password"
					value={credentials.password}
					onChange={handleChange}
				/>
			</label>
			<button type="submit">Submit</button>
		</form>
	);
};

export default SignIn;
