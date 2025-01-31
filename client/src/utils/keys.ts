const versionRiotApi = "15.2.1";

const keys = {
	API_URL: import.meta.env.VITE_API_URL,
	DDRAGON_API_URL: import.meta.env.VITE_DDRAGON_API_URL,
	CHAMPION_IMG_SQUARE: `https://ddragon.leagueoflegends.com/cdn/${versionRiotApi}/img/champion`,
	CHAMPION_IMG_SPLASH:
		"https://ddragon.leagueoflegends.com/cdn/img/champion/splash",
	PROFILE_ICON: `https://ddragon.leagueoflegends.com/cdn/${versionRiotApi}/img/profileicon`,
};

export default keys;
