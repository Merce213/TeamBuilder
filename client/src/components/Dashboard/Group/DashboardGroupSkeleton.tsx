import CoreContainer from "../../CoreContainer";

const DashboardGroupSkeleton = () => {
	return (
		<CoreContainer className="h-screen-navbar flex flex-col items-center justify-center">
			<div className="bg-secondary-dark-6 w-full max-w-screen-lg flex flex-col p-4 gap-4 s-md:gap-6 rounded-lg shadow-md animate-pulse">
				<div
					id="header"
					className="flex justify-between items-center gap-4 w-full"
				>
					<div className="h-8 bg-gray-light-3 rounded w-1/3"></div>
					<div className="h-8 bg-gray-light-3 rounded w-24"></div>
				</div>

				<div id="description" className="flex flex-col">
					<div className="h-4 bg-gray-light-3 rounded w-2/3"></div>
				</div>

				<hr className="bg-text h-px" />

				<div
					id="members"
					aria-label="members"
					className="flex flex-col gap-2"
				>
					<div className="flex items-center gap-2">
						<div className="h-6 bg-gray-light-3 rounded w-24"></div>
						<div className="h-6 bg-gray-light-3 rounded w-8"></div>
					</div>

					<div
						id="members-list"
						aria-label="members-list"
						className="w-full overflow-x-auto"
					>
						<table className="w-full">
							<thead className="bg-secondary-dark-7">
								<tr>
									{[
										"Avatar",
										"Summoner Name",
										"Username",
										"Email",
										"Role",
									].map((header) => (
										<th
											key={header}
											className="p-3 text-left"
										>
											<div className="h-6 bg-gray-light-3 rounded w-3/4"></div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{[...Array(2)].map((_, index) => (
									<tr
										key={index}
										className="border-b border-secondary-dark-7"
									>
										<td className="p-3">
											<div className="w-10 h-10 s-sm:w-16 s-sm:h-16 bg-gray-light-3 rounded-full"></div>
										</td>
										{[...Array(4)].map((_, cellIndex) => (
											<td key={cellIndex} className="p-3">
												<div className="h-6 bg-gray-light-3 rounded w-3/4"></div>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</CoreContainer>
	);
};

export default DashboardGroupSkeleton;
