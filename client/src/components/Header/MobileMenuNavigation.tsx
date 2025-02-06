import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

const MobileMenuNavigation = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const navigationMenuRef = useRef<HTMLDivElement | null>(null);
	const triggerRef = useRef<HTMLButtonElement | null>(null);

	const toggleMenuNavigation = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				navigationMenuRef.current &&
				!navigationMenuRef.current.contains(event.target as Node) &&
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
			<button
				ref={triggerRef}
				type="button"
				className="items-center p-1 text-sm rounded-lg s-sm:hidden btn-accent-outline duration-150"
				onClick={toggleMenuNavigation}
				aria-haspopup="true"
				aria-expanded={isOpen}
				aria-controls="mobile-menu-navigation"
			>
				<Menu />
			</button>

			{isOpen && (
				<div
					id="mobile-menu-navigation"
					ref={navigationMenuRef}
					role="menu"
					aria-modal="true"
					className="absolute left-0 z-10 w-40 mt-2 bg-background rounded-md shadow-xl border border-gray-light-3 animate-fade-in duration-150"
				>
					<div className="px-4 py-3">
						<NavLink
							to="/"
							className={({ isActive }) =>
								`p-2 rounded-lg block transition-all ${
									isActive
										? "text-primary"
										: "hover:text-primary"
								}`
							}
						>
							Home
						</NavLink>
						<NavLink
							to="/champions"
							className={({ isActive }) =>
								`p-2 rounded-lg block transition-all ${
									isActive
										? "text-primary"
										: "hover:text-primary"
								}`
							}
						>
							Champions
						</NavLink>
					</div>
				</div>
			)}
		</div>
	);
};

export default MobileMenuNavigation;
