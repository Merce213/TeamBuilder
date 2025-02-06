import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword } from "../../api/auth";

const ChangeForgotPassword = () => {
	const [searchParams] = useSearchParams();
	const [newPassword, setNewPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	const navigate = useNavigate();

	const changeForgotPasswordMutation = useMutation({
		mutationFn: () => resetPassword({ token: token!, newPassword }),
		onSuccess: () => {
			setTimeout(() => navigate("/signin"), 3000);
		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(`Failed to change password: ${error.message}`, {
					style: {
						padding: "16px",
					},
				});
				return;
			}
			setErrors(error);
		},
	});

	const token = searchParams.get("token");

	if (!token) {
		changeForgotPasswordMutation.error = new Error("Invalid token");
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "newPassword") {
			setNewPassword(value);
		} else if (name === "confirmPassword") {
			setConfirmPassword(value);
		}

		if (errors[name]) {
			setErrors((prevErrors) => {
				const newErrors = { ...prevErrors };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});

		if (newPassword !== confirmPassword) {
			setErrors({
				...errors,
				confirmPassword: "Passwords do not match.",
			});
			return;
		}

		changeForgotPasswordMutation.mutate();
	};

	return (
		<div className="py-4 px-5 container mt-16 h-screen-navbar flex justify-center items-center">
			<div className="p-4 bg-gray-dark-2 rounded-lg shadow-md w-full max-w-2xl">
				<h1 className="text-2xl font-bold mb-4 text-center">
					Reset Your Password
				</h1>
				<p className="text-center mb-4 text-gray-light-6">
					Enter your new password below to reset your account
					password.
				</p>
				{changeForgotPasswordMutation.isSuccess ? (
					<div className="text-green-500 text-center mb-4">
						Password reset successfully. Redirecting to login...
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<label className="block">
							<span className="block font-medium text-gray-light-8">
								New Password:
							</span>
							<input
								type="password"
								name="newPassword"
								value={newPassword}
								onChange={handleChange}
								className="mt-1 block w-full px-3 py-2 border-2 rounded-md shadow-sm"
								required
								aria-invalid={
									errors.newPassword ? "true" : "false"
								}
							/>
							{errors.newPassword && (
								<p
									className="text-danger-light-3 mt-1 text-sm"
									role="alert"
								>
									{errors.newPassword}
								</p>
							)}
						</label>
						<label className="block">
							<span className="block font-medium text-gray-light-8">
								Confirm New Password:
							</span>
							<input
								type="password"
								name="confirmPassword"
								value={confirmPassword}
								onChange={handleChange}
								className="mt-1 block w-full px-3 py-2 border-2 rounded-md shadow-sm"
								required
								aria-invalid={
									errors.confirmPassword ? "true" : "false"
								}
							/>
							{errors.confirmPassword && (
								<p
									className="text-danger-light-3 mt-1 text-sm"
									role="alert"
								>
									{errors.confirmPassword}
								</p>
							)}
						</label>
						<div className="flex justify-center items-center">
							<button
								type="submit"
								className="w-24 s-lg:w-64 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md hover:bg-primary hover:text-text transition-all cursor-pointer"
								disabled={
									changeForgotPasswordMutation.isPending ||
									!newPassword ||
									!confirmPassword
								}
							>
								{changeForgotPasswordMutation.isPending
									? "Resetting..."
									: "Reset Password"}
							</button>
						</div>
					</form>
				)}
				{changeForgotPasswordMutation.isError && (
					<p
						className="text-danger-light-3 text-sm text-center mt-4"
						role="alert"
					>
						An error occurred. Please try again.
					</p>
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

export default ChangeForgotPassword;
