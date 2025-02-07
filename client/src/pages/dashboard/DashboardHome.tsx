import CoreContainer from "../../components/CoreContainer";
import GroupList from "../../components/Dashboard/Home/GroupList";
import TeamList from "../../components/Dashboard/Home/TeamList";
import ProfileCard from "../../components/Summoners/ProfileCard";

const DashboardHome = () => {
	return (
		<CoreContainer className="h-screen-navbar flex flex-col items-center justify-center">
			<div className="bg-secondary-dark-6 w-full max-w-screen-lg flex flex-col p-4 gap-4 s-md:gap-8 rounded-lg shadow-md">
				<div
					id="header"
					className="flex justify-between items-center gap-4 w-full"
				>
					<h1 className="text-base s-md:text-2xl font-sora font-bold">
						Dashboard
					</h1>
				</div>

				<hr className="bg-text h-px" />

				<div className="flex justify-center">
					<ProfileCard />
				</div>

				<hr className="bg-text h-px" />

				<div className="flex flex-col gap-4">
					<GroupList />
					<TeamList />
				</div>
			</div>
		</CoreContainer>
	);
};

export default DashboardHome;
