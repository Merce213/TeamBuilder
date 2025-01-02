import { SeparatorHorizontal, SquarePlus } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useLayout } from "../../contexts/LayoutContext";
import Popover from "../Popover";

const Sidebar = () => {
	const { isSidebarOpen, setSidebarOpen } = useLayout();
	const sidebarRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node)
			) {
				setSidebarOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isSidebarOpen]);

	return (
		<>
			{isSidebarOpen && (
				<div className="fixed inset-0 bg-gray sidebar"></div>
			)}
			<aside
				ref={sidebarRef}
				id="sidebar"
				className={`fixed top-0 left-0 z-40 border-r border-gray-light-3 w-64 h-screen transition-all bg-gray ${
					isSidebarOpen
						? "translate-x-0"
						: "s-sm:translate-x-0 -translate-x-full"
				}`}
			>
				<div className="h-full flex flex-col justify-between">
					<Popover
						position="bottom"
						content={
							<div className="flex flex-col p-2">
								<div className="overflow-y-auto max-h-40">
									<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
										Team 1
									</p>
									<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
										Team 2
									</p>
									<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
										Team 3
									</p>
									<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
										Team 4
									</p>
									<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
										Team 5
									</p>
								</div>
								<div className="border-t border-gray-light-3 text-primary">
									<div className="py-2 ps-2 hover:bg-gray-light-1 flex items-center w-full cursor-pointer">
										<SquarePlus />
										<p className="ps-2">Create Team</p>
									</div>
								</div>
							</div>
						}
					>
						<div className="flex items-center justify-between w-full text-primary">
							<p className="font-sora">Select a Team</p>
							<SeparatorHorizontal />
						</div>
					</Popover>

					<div className="flex items-center p-3 flex-1">
						<div className="flex flex-col">
							<NavLink
								to="/test"
								className={({ isActive }) =>
									`flex items-center p-1 rounded-lg transition-all duration-75 ${
										isActive
											? "text-primary"
											: "text-text hover:text-primary"
									}`
								}
							>
								<span>Dashboard</span>
							</NavLink>
							<NavLink
								to={"/test2"}
								className={({ isActive }) =>
									`flex items-center p-1 rounded-lg transition-all duration-75 ${
										isActive
											? "text-primary"
											: "text-text hover:text-primary"
									}`
								}
							>
								<span>Home</span>
							</NavLink>
						</div>
					</div>
					<Popover
						position="top"
						content={
							<div className="flex flex-col p-2">
								<div className="overflow-y-auto max-h-40">
									<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
										Group 1
									</p>
									<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
										Group 2
									</p>
									<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
										Group 3
									</p>
									<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
										Group 4
									</p>
									<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
										Group 5
									</p>
								</div>
								<div className="border-t border-gray-light-3 text-primary">
									<div className="py-2 ps-2 hover:bg-gray-light-1 flex w-full cursor-pointer">
										<SquarePlus />
										<p className="ps-2">Create Group</p>
									</div>
								</div>
							</div>
						}
					>
						<div className="flex items-center justify-between w-full text-primary">
							<p className="font-sora">Select a Group</p>
							<SeparatorHorizontal />
						</div>
					</Popover>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
