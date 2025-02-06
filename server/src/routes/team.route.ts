import { Router } from "express";
import {
	createTeam,
	getAllTeamsByGroupId,
	getTeamById,
	updateTeam,
	deleteTeam,
} from "../controllers/team.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import {
	checkGroupAccess,
	checkTeamAccess,
} from "../middlewares/authorization.middleware";
import { validateData } from "../middlewares/validation.middleware";
import {
	CreateTeamSchema,
	GetAllTeamsSchema,
	ParamsTeamSchema,
	UpdateTeamSchema,
} from "../schemas/team.schema";

const router: Router = Router();

router.post(
	"/:userId/groups/:groupId/teams",
	[authenticate, validateData(CreateTeamSchema), checkGroupAccess()],
	createTeam
);
router.get(
	"/:userId/groups/:groupId/teams",
	[authenticate, validateData(GetAllTeamsSchema), checkGroupAccess()],
	getAllTeamsByGroupId
);
router.get(
	"/:userId/groups/:groupId/teams/:teamId",
	[authenticate, validateData(ParamsTeamSchema), checkGroupAccess()],
	getTeamById
);
router.put(
	"/:userId/groups/:groupId/teams/:teamId",
	[authenticate, validateData(UpdateTeamSchema), checkTeamAccess()],
	updateTeam
);
router.delete(
	"/:userId/groups/:groupId/teams/:teamId",
	[authenticate, validateData(ParamsTeamSchema), checkTeamAccess()],
	deleteTeam
);

export default router;
