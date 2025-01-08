import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signIn } from "../../api/auth";

const SignIn = () => {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [errorMessage, setErrorMessage] = useState<string>("");

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

			window.location.href = "/";
		} catch (error) {
			console.error("Error:", error);
			setErrorMessage("An error occurred while signing in.");
		}
	};

	return (
		<div className="py-4 px-5 container mt-16 h-screen-navbar flex justify-center items-center">
			<div className="p-4 bg-gray-dark-2 rounded-lg shadow-md w-full max-w-2xl">
				<h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<label className="block">
						<span className="block font-medium text-gray-light-8">
							Username:
						</span>
						<input
							type="text"
							name="username"
							value={credentials.username}
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 border-2 rounded-md shadow-sm"
						/>
						{errors && (
							<p className="text-danger-light-3 mt-1 text-sm">
								{errors.username}
							</p>
						)}
					</label>
					<label className="block">
						<span className="block font-medium text-gray-light-8">
							Password:
						</span>
						<input
							type="password"
							name="password"
							value={credentials.password}
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 border-2 rounded-md shadow-sm"
						/>
						{errors && (
							<p className="text-danger-light-3 mt-1 text-sm">
								{errors.password}
							</p>
						)}
					</label>
					{errorMessage && (
						<p className="text-danger-light-3 text-sm">
							{errorMessage}
						</p>
					)}
					<div className="flex justify-center items-center">
						<button
							type="submit"
							className=" w-24 s-lg:w-64 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md hover:bg-primary hover:text-text transition-all cursor-pointer"
						>
							Sign In
						</button>
					</div>
				</form>
				<div className="mt-4 flex justify-center items-center">
					<p className="text-gray-light-8">Don't have an account?</p>
					<Link
						to="/signup"
						className="ml-2 text-primary hover:underline"
					>
						Sign Up
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
