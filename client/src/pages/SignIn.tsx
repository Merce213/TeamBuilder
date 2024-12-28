import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../api/auth";

const SignIn = () => {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [errorMessage, setErrorMessage] = useState<string>("");

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

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const response = await signIn(credentials);

			if (!response.ok) {
				const errorData = await response.json();
				if (errorData.errors) {
					setErrors(errorData.errors);
				} else {
					setErrorMessage(errorData.error);
				}
				return;
			}

			navigate("/");
			navigate(0);
		} catch (error) {
			console.error("Error:", error);
			setErrorMessage("An error occurred while signing in.");
		}
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
				{errors && <p>{errors.username}</p>}
			</label>
			<label>
				Password:
				<input
					type="password"
					name="password"
					value={credentials.password}
					onChange={handleChange}
				/>
				{errors && <p>{errors.password}</p>}
			</label>
			{errorMessage && <p>{errorMessage}</p>}
			<button type="submit">Submit</button>
		</form>
	);
};

export default SignIn;
