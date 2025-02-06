import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { sendPasswordResetLink } from "../../api/auth";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>("");

	const sendPasswordResetLinkMutation = useMutation({
		mutationFn: async () => await sendPasswordResetLink(email),
		onSuccess: (data) => {
			setErrors({});
			setErrorMessage("");
			setSuccessMessage(data.message);
		},
		onError: (error) => {
			if (error instanceof Error) {
				setErrorMessage(error.message);
				return;
			}
			setErrors(error);
			return;
		},
	});

	return (
		<div className="py-4 px-5 container mt-16 h-screen-navbar flex justify-center items-center">
			<div className="p-4 bg-gray-dark-2 rounded-lg shadow-md w-full max-w-2xl">
				<h1 className="text-2xl font-bold mb-4 text-center">
					Forgot Password
				</h1>
				<p className="text-center mb-4 text-gray-light-6">
					Enter your email address and we'll send you a link to reset
					your password.
				</p>
				{successMessage ? (
					<div className="text-green-500 text-center mb-4">
						{successMessage}
					</div>
				) : (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							sendPasswordResetLinkMutation.mutate();
						}}
						className="space-y-4"
					>
						<label className="block">
							<span className="block font-medium text-gray-light-8">
								Email:
							</span>
							<input
								type="email"
								name="email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setErrors({});
									setErrorMessage("");
								}}
								className="mt-1 block w-full px-3 py-2 border-2 rounded-md shadow-sm"
								required
								aria-invalid={errors.email ? "true" : "false"}
							/>
							{errors.email && (
								<p
									className="text-danger-light-3 mt-1 text-sm"
									role="alert"
								>
									{errors.email}
								</p>
							)}
						</label>
						{errorMessage && (
							<p
								className="text-danger-light-3 text-sm"
								role="alert"
							>
								{errorMessage}
							</p>
						)}
						<div className="flex justify-center items-center">
							<button
								type="submit"
								className="w-24 s-lg:w-64 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md hover:bg-primary hover:text-text transition-all cursor-pointer"
								disabled={
									sendPasswordResetLinkMutation.isPending
								}
							>
								{sendPasswordResetLinkMutation.isPending
									? "Sending..."
									: "Send Reset Link"}
							</button>
						</div>
					</form>
				)}
				<div className="mt-4 text-center">
					<Link to="/signin" className="text-primary hover:underline">
						Back to Login
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
