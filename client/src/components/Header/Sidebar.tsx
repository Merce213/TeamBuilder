import { SeparatorHorizontal, SquarePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useGroup } from "../../contexts/GroupContext";
import { useLayout } from "../../contexts/LayoutContext";
import { Group } from "../../types/Group";
import CreateGroupModal from "../Groups/CreateGroupModal";
import Popover from "../Popover";

const Sidebar = () => {
	const { isSidebarOpen, setSidebarOpen } = useLayout();
	const sidebarRef = useRef<HTMLDivElement | null>(null);

	const [isClickedPopover, setIsClickedPopover] = useState(false);
	const [openModalCreateGroup, setOpenModalCreateGroup] = useState(false);

	const handleOpenModalCreateGroup = () => {
		setOpenModalCreateGroup(!openModalCreateGroup);
	};

	const handleClickPopover = () => {
		setIsClickedPopover(!isClickedPopover);
		setSidebarOpen(false);
	};

	const {
		groups,
		isLoadingGroups,
		groupsError,
		groupData,
		selectedGroupId,
		handleSelectGroup,
	} = useGroup();

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
	}, [sidebarRef]);

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
						isClicked={isClickedPopover}
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

					<div className="flex flex-col justify-center p-3 gap-2">
						<div className="flex flex-col">
							<NavLink
								to="/champions"
								className={({ isActive }) =>
									`flex items-center p-1 rounded-lg transition-all duration-75 ${
										isActive
											? "text-primary"
											: "text-text hover:text-primary"
									}`
								}
							>
								<span>Champions</span>
							</NavLink>
						</div>

						<div className="flex flex-col">
							<p className="text-sm text-gray-light-7">
								Dashboard
							</p>
							<NavLink
								to="/dashboard"
								end
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
							<NavLink
								to={"/dashboard/group"}
								className={({ isActive }) =>
									`flex items-center p-1 rounded-lg transition-all duration-75 ${
										isActive
											? "text-primary"
											: "text-text hover:text-primary"
									}`
								}
							>
								<span>Group</span>
							</NavLink>
							<NavLink
								to={"/dashboard/team"}
								className={({ isActive }) =>
									`flex items-center p-1 rounded-lg transition-all duration-75 ${
										isActive
											? "text-primary"
											: "text-text hover:text-primary"
									}`
								}
							>
								<span>Team</span>
							</NavLink>
						</div>

						<div className="flex flex-col">
							<p className="text-sm text-gray-light-7">Account</p>
							<NavLink
								to="/dashboard/profile"
								className={({ isActive }) =>
									`flex items-center p-1 rounded-lg transition-all duration-75 ${
										isActive
											? "text-primary"
											: "text-text hover:text-primary"
									}`
								}
							>
								<span>Profile</span>
							</NavLink>
							<NavLink
								to={"/dashboard/all-groups"}
								className={({ isActive }) =>
									`flex items-center p-1 rounded-lg transition-all duration-75 ${
										isActive
											? "text-primary"
											: "text-text hover:text-primary"
									}`
								}
							>
								<span>All Groups</span>
							</NavLink>
							<NavLink
								to={"/dashboard/all-teams"}
								className={({ isActive }) =>
									`flex items-center p-1 rounded-lg transition-all duration-75 ${
										isActive
											? "text-primary"
											: "text-text hover:text-primary"
									}`
								}
							>
								<span>All Teams</span>
							</NavLink>
						</div>
					</div>

					<Popover
						isClicked={isClickedPopover}
						position="top"
						content={
							<div className="flex flex-col p-2">
								{isLoadingGroups ? (
									<p>Loading groups...</p>
								) : groupsError ? (
									<p className="text-danger">
										Error loading groups
									</p>
								) : (
									<div className="overflow-y-auto max-h-40">
										{groups
											?.filter(
												(group) =>
													group.id !== selectedGroupId
											)
											.map((group: Group) => (
												<p
													key={group.id}
													className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer"
													onClick={() => {
														handleSelectGroup(
															group
														);
														handleClickPopover();
													}}
												>
													{group.name}
												</p>
											))}
										<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
											Group X
										</p>
										<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
											Group Y
										</p>
										<p className="py-2 ps-2 hover:bg-gray-light-1 cursor-pointer">
											Group Z
										</p>
									</div>
								)}
								<div
									className="border-t border-gray-light-3 text-primary"
									onClick={handleOpenModalCreateGroup}
								>
									<div
										className="py-2 ps-2 hover:bg-gray-light-1 flex w-full cursor-pointer"
										onClick={handleClickPopover}
									>
										<SquarePlus />
										<p className="ps-2">Create Group</p>
									</div>
								</div>
							</div>
						}
					>
						<div className="flex items-center justify-between w-full text-primary">
							<p className="font-sora">
								{groupData?.name || "Select a Group"}
							</p>
							<SeparatorHorizontal />
						</div>
					</Popover>
				</div>
			</aside>

			{openModalCreateGroup && (
				<CreateGroupModal
					openModalCreateGroup={openModalCreateGroup}
					setOpenModalCreateGroup={setOpenModalCreateGroup}
				/>
			)}
		</>
	);
};

export default Sidebar;
