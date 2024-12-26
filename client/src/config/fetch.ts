const refreshTokens = async (): Promise<void> => {
	// Appel de l'API de rafraîchissement pour obtenir un nouveau token
	const refreshResponse = await fetch("/refresh", {
		method: "POST",
		credentials: "include", // S'assurer que les cookies sont envoyés avec la requête
	});

	if (!refreshResponse.ok) {
		throw new Error("Session expired. Please login again.");
	}

	// Vous pouvez également stocker ou gérer les nouveaux tokens ici si nécessaire.
};

// Fonction pour gérer la requête avec rafraîchissement automatique du token
const fetchWithRefresh = async (
	url: string,
	options: RequestInit = {}
): Promise<any> => {
	const response = await fetch(url, {
		...options,
		credentials: "include", // Inclure les cookies
	});

	// Si la réponse est une erreur 401 (token expiré), tenter de rafraîchir le token
	if (response.status === 401) {
		try {
			// Essayer de rafraîchir le token
			await refreshTokens();

			// Refaire la requête initiale avec un nouveau token après le rafraîchissement
			const retryResponse = await fetch(url, {
				...options,
				credentials: "include",
			});

			if (!retryResponse.ok) {
				throw new Error("Request failed after token refresh.");
			}

			return retryResponse.json();
		} catch (error) {
			// Si le rafraîchissement échoue, informer l'utilisateur qu'il doit se reconnecter
			throw new Error("Session expired. Please login again.");
		}
	}

	if (!response.ok) {
		throw new Error(await response.text()); // Rejeter en cas d'autres erreurs
	}

	return response.json();
};
