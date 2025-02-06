import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getChampion } from "../api/champions";
import { Lane, Skin, Tag } from "../types/Champion";
import keys from "../utils/keys";

const Champion = () => {
	const { nameId } = useParams();

	const {
		data: champion,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["champion", nameId],
		queryFn: () => getChampion(nameId!),
		retry: 1,
	});

	if (isLoading) {
		return (
			<div className="container mt-16 py-4 px-6 h-screen-navbar flex items-center justify-center">
				Loading...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="container mt-16 py-4 px-6">
				Error: {error.message} : {nameId}
			</div>
		);
	}

	return (
		<>
			<section
				aria-label="champion-background"
				className="relative py-8 px-0 container mt-16 min-h-bg flex flex-col"
			>
				<div
					aria-label="champion-backdrop"
					className="absolute inset-0 w-full h-full overflow-hidden"
				>
					<img
						src={`${keys.CHAMPION_IMG_SPLASH}/${champion?.nameId}_0.jpg`}
						alt={champion?.name}
						className="w-full h-full object-cover"
						loading="lazy"
					/>
					<div className="absolute inset-0 bg-background opacity-50"></div>
				</div>

				<div
					aria-label="champion-content"
					className="relative h-full w-full flex flex-col justify-center flex-grow px-6"
				>
					<div
						aria-label="champion-top-content"
						className="flex flex-col gap-8 s-md:flex-row s-md:items-center s-md:justify-between"
					>
						<div
							aria-label="champion-header"
							className="max-w-2xl flex flex-col gap-4"
						>
							<div aria-label="champion-title">
								<p className="text-2xl text-primary-light-3 uppercase font-sora font-italic font-bold">
									{champion?.title}
								</p>
							</div>
							<div aria-label="champion-name">
								<h1 className="text-3xl uppercase font-bold">
									{champion?.name}
								</h1>
							</div>
							<div aria-label="champion-body">
								<p>{champion?.lore}</p>
							</div>
						</div>

						<div aria-label="champion-lane-role">
							<div className="flex flex-col md:flex-row gap-4">
								<div className="flex gap-2 text-sm uppercase">
									<p className="text-primary-light-3 font-bold">
										Lane:
									</p>
									{champion?.lanes.map((lane: Lane) => (
										<p key={lane}>{lane}</p>
									))}
								</div>
								<div className="flex gap-2 text-sm uppercase">
									<p className="text-primary-light-3 font-bold">
										Role:
									</p>
									{champion?.tags.map((role: Tag) => (
										<p key={role}>{role}</p>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section
				aria-label="champion-stats"
				className="py-4 px-5 container bg-primary"
			>
				<div aria-label="champion-stats-title" className="mb-4">
					<h2 className="text-2xl text-background font-sora font-italic font-bold uppercase">
						Stats
					</h2>
				</div>

				<div
					aria-label="champion-stats-body"
					className="flex flex-col gap-4 s-sm:flex-row s-sm:items-center s-sm:justify-between"
				>
					<div className="flex flex-col gap-1 s-sm:items-end">
						<div className="flex gap-2">
							<p className="text-background-dark-5 font-medium">
								Difficulty:
							</p>
							<p className="text-secondary-dark-2">
								{champion?.info.difficulty}
							</p>
						</div>
						<div className="flex gap-2">
							<p className="text-background-dark-5 font-medium">
								Attack:
							</p>
							<p className="text-secondary-dark-2">
								{champion?.info.attack}
							</p>
						</div>
						<div className="flex gap-2">
							<p className="text-background-dark-5 font-medium">
								Magic:
							</p>
							<p className="text-secondary-dark-2">
								{champion?.info.magic}
							</p>
						</div>
						<div className="flex gap-2">
							<p className="text-background-dark-5 font-medium">
								Defense:
							</p>
							<p className="text-secondary-dark-2">
								{champion?.info.defense}
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-1 s-sm:items-end">
						<div className="flex gap-2">
							<p className="text-background-dark-5 font-medium">
								Critical:
							</p>
							<p className="text-secondary-dark-2">
								{champion?.stats.crit}
							</p>
						</div>
						<div className="flex gap-2">
							<p className="text-background-dark-5 font-medium">
								Damage:
							</p>
							<p className="text-secondary-dark-2">
								{champion?.stats.attackDamage}
							</p>
						</div>
						<div className="flex gap-2">
							<p className="text-background-dark-5 font-medium">
								Range:
							</p>
							<p className="text-secondary-dark-2">
								{champion?.stats.attackRange}
							</p>
						</div>
						<div className="flex gap-2">
							<p className="text-background-dark-5 font-medium">
								Armor:
							</p>
							<p className="text-secondary-dark-2">
								{champion?.stats.armor}
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-1 s-sm:items-end">
						<div className="flex gap-2">
							<p className="text-background-dark-5 font-medium">
								Health:
							</p>
							<p className="text-secondary-dark-2">
								{champion?.stats.hp}
							</p>
						</div>
						<div className="flex gap-2">
							<p className="text-background-dark-5 font-medium">
								Mana:
							</p>
							<p className="text-secondary-dark-2">
								{champion?.stats.mp}
							</p>
						</div>
						<div className="flex gap-2">
							<p className="text-background-dark-5 font-medium">
								Move Speed:
							</p>
							<p className="text-secondary-dark-2">
								{champion?.stats.moveSpeed}
							</p>
						</div>
						<div className="flex gap-2">
							<p className="text-background-dark-5 font-medium">
								Mana:
							</p>
							<p className="text-secondary-dark-2">
								{champion?.stats.mp}
							</p>
						</div>
					</div>
				</div>
			</section>

			<section
				aria-label="champion-skins"
				className="py-4 px-5 container bg-text-light-3"
			>
				<div aria-label="champion-skins-title" className="mb-4">
					<h2 className="text-2xl text-background font-sora font-italic font-bold uppercase">
						Available Skins
					</h2>
				</div>
				<div
					aria-label="champion-skins"
					className="flex gap-4 justify-center"
				>
					<div className="wrapper">
						<nav className="lil-nav">
							{champion?.skins.map((skin: Skin) => (
								<a
									key={skin.id}
									href={`#${skin.skinId}`}
									title={skin.name}
								>
									<img
										src={`${keys.CHAMPION_IMG_SPLASH}/${champion?.nameId}_${skin.num}.jpg`}
										alt={skin.name}
										className="lil-nav_img"
										loading="lazy"
									/>
								</a>
							))}
						</nav>

						<div className="gallery">
							{champion?.skins.map((skin: Skin) => (
								<div
									key={skin.id}
									className="relative min-w-full h-full flex flex-col items-center justify-center"
								>
									<img
										key={skin.id}
										id={skin.skinId}
										src={`${keys.CHAMPION_IMG_SPLASH}/${champion?.nameId}_${skin.num}.jpg`}
										alt={skin.name}
										className="gallery_img absolute inset-0 w-full h-full object-cover"
										loading="lazy"
									/>
									<div className="absolute inset-0 bg-background opacity-30"></div>

									<div className="relative">
										<h3 className="s-lg:text-2xl text-primary-light-3 font-bold uppercase">
											{skin.name}
										</h3>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Champion;
