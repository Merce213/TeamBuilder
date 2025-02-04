import CoreContainer from "../../components/CoreContainer";

const DashboardTeam = () => {
	return (
		<>
			<CoreContainer className="h-screen-navbar flex flex-col items-center justify-center">
				<div className="bg-secondary-dark-6 w-full max-w-screen-lg flex flex-col p-4 gap-4 s-md:gap-6 rounded-lg shadow-md">
					<div
						id="header"
						className="flex justify-between items-center gap-4 w-full"
					>
						<h1 className="text-base s-md:text-2xl font-sora font-bold">
							Team Name
						</h1>
						{/* {isOwner && (
							<div
								className="flex gap-2 items-center p-1 s-sm:p-2 cursor-pointer border rounded-md hover:text-accent-light-3 transition-all"
								onClick={() => setOpenModalEditGroup(true)}
							>
								<Pencil className="w-4 h-4" />
								<p className="text-sm s-sm:text-base">Edit</p>
							</div>
						)} */}
					</div>
				</div>
			</CoreContainer>
		</>
	);
};

export default DashboardTeam;
