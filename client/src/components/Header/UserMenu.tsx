import { CircleUserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { signOut } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";

const UserMenu = ({ className }: { className?: string }) => {
	const { user, setUser } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const userMenuRef = useRef<HTMLDivElement | null>(null);
	const triggerRef = useRef<HTMLDivElement | null>(null);

	const handleSignOut = async () => {
		try {
			const response = await signOut();
			if (!response.ok) {
				const errorData = await response.json();
				// toast.error("Error signing out");
				return;
			}

			// toast.success("Signed out successfully");
			setUser(null);
		} catch (error) {
			console.error("Error:", error);
			// toast.error("Error signing out");
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node) &&
				!triggerRef.current?.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative">
			<div
				ref={triggerRef}
				onClick={() => setIsOpen(!isOpen)}
				className={`items-center p-2 ${className} transition-all rounded-lg cursor-pointer`}
				aria-haspopup="true"
				aria-expanded={isOpen}
				aria-controls="popover-user-menu-content"
			>
				{user ? (
					<div className="flex items-center gap-2">
						<CircleUserRound className="w-8 h-8" />
						{user && (
							<div className="hidden s-sm:flex flex-col">
								<p className="text-left text-sm">
									{user.username}
								</p>
								<p className="text-xs text-gray-light-6">
									{user.email}
								</p>
							</div>
						)}
					</div>
				) : (
					<Link to="/signin" className="flex items-center gap-2">
						<CircleUserRound className="w-8 h-8" />
						<p>Sign In</p>
					</Link>
				)}
			</div>
			{isOpen && user && (
				<div
					ref={userMenuRef}
					id="popover-user-menu-content"
					role="menu"
					aria-modal="true"
					className="absolute right-0 z-10 w-56 mt-2 bg-background rounded-md shadow-xl border border-gray-light-3 animate-fade-in duration-150"
				>
					<div className="p-2">
						<NavLink
							to="/dashboard"
							className="block ps-2 py-2 hover:bg-gray-light-1"
						>
							Dashboard
						</NavLink>
						<NavLink
							to="/profile"
							className="block ps-2 py-2 hover:bg-gray-light-1"
						>
							Profile
						</NavLink>
						<span
							className="block ps-2 py-2 text-danger hover:bg-danger-dark-8 cursor-pointer"
							onClick={handleSignOut}
						>
							Sign Out
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserMenu;