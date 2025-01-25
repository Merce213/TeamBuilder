const Profile = () => {
	return (
		<>
			<div className="w-full">
				<label htmlFor="summonerName" className="">
					Summoner Name
				</label>
				<input
					id="summonerName"
					type="text"
					className="mt-1 block w-full px-3 py-1 border-2 rounded-md shadow-sm"
				/>
			</div>
			<div className="w-full h-full bg-primary rounded-md p-2">test</div>
		</>
	);
};

export default Profile;
