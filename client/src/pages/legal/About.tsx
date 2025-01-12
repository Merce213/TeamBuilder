const About = () => {
	return (
		<div className="container mt-16 py-6 flex flex-col items-center h-navbar">
			<h1 className="text-4xl font-sora font-bold text-center">
				About us
			</h1>

			<div className="mt-8 flex flex-col justify-center gap-2 max-w-4xl">
				<p>
					TeamBuilder Lol is a website that allows you to create and
					manage team compositions for the popular game League of
					Legends.
				</p>
				<p>
					Our goal is to provide a simple and intuitive tool for
					players to create and share their team compositions. We also
					want to provide a platform for players to discover new
					champions and team compositions.
				</p>
				<p>
					We are a team of passionate gamers and developers who are
					dedicated to making TeamBuilder Lol the best it can be.
				</p>
			</div>
		</div>
	);
};

export default About;
