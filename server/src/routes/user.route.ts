import { Router } from "express";
import {
	deleteUser,
	getAllUsers,
	getFavoriteChampions,
	getFavoriteLanes,
	getUser,
	searchUsers,
	updateFavoriteChampions,
	updateFavoriteLanes,
	updateUser,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import { checkAuthorization } from "../middlewares/authorization.middleware";
import { validateData } from "../middlewares/validation.middleware";
import {
	GetSummonerInfoSchema,
	UserUpdateSchema,
	updateFavoriteChampionsSchema,
	updateFavoriteLanesSchema,
} from "../schemas/user.schema";

const router: Router = Router();

// User routes
router.get(
	"/all",
	[authenticate, checkAuthorization(true, false)],
	getAllUsers
);
router.get("/search", authenticate, searchUsers);

router.get("/:userId", [authenticate, checkAuthorization()], getUser);
router.patch(
	"/:userId",
	[authenticate, validateData(UserUpdateSchema), checkAuthorization()],
	updateUser
);
router.delete("/:userId", [authenticate, checkAuthorization()], deleteUser);

// Favorite's User routes
router.get(
	"/:userId/favorite-lanes",
	[authenticate, validateData(GetSummonerInfoSchema), checkAuthorization()],
	getFavoriteLanes
);
router.get(
	"/:userId/favorite-champions",
	[authenticate, validateData(GetSummonerInfoSchema), checkAuthorization()],
	getFavoriteChampions
);
router.put(
	"/:userId/favorite-lanes",
	[
		authenticate,
		validateData(updateFavoriteLanesSchema),
		checkAuthorization(),
	],
	updateFavoriteLanes
);
router.put(
	"/:userId/favorite-champions",
	[
		authenticate,
		validateData(updateFavoriteChampionsSchema),
		checkAuthorization(),
	],
	updateFavoriteChampions
);

export default router;
