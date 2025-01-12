import { Link } from "react-router-dom";
import videoBg from "../assets/videos/videoBg.mp4";

const Home = () => {
	return (
		<div className="relative w-full h-screen-navbar mt-16">
			<div
				aria-label="overlay"
				className="absolute inset-0 bg-background opacity-60"
			></div>
			<video
				className="w-full h-full object-cover"
				src={videoBg}
				autoPlay
				loop
				muted
			/>
			<div
				aria-label="content"
				className="absolute inset-0 flex backdrop-blur-sm bg-transparent"
			>
				<div className="container">
					<div className="flex flex-col items-center justify-center h-full text-primary font-sora gap-4">
						<h1 className="text-4xl font-bold text-center">
							Welcome to TeamBuilder Lol
						</h1>
						<p className="text-lg font-semibold max-w-sm s-md:max-w-lg text-center">
							Your one-stop solution for creating and managing
							compositions for your favorite game
						</p>
						<div className="flex flex-col gap-2">
							<Link
								to={"/signup"}
								className="btn-primary p-2 hover:text-text-dark-2 hover:bg-primary-dark-3"
							>
								Get Started
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
