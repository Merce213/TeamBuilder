import { Router } from "express";
import { createTeam } from "../controllers/team.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import { checkGroupAccess } from "../middlewares/authorization.middleware";
import { validateData } from "../middlewares/validation.middleware";
import { CreateTeamSchema } from "../schemas/team.schema";

const router: Router = Router();

router.post(
	"/:userId/groups/:groupId/teams",
	[authenticate, validateData(CreateTeamSchema), checkGroupAccess()],
	createTeam
);

export default router;
