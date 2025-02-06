import { Router } from "express";
import {
	acceptInvitation,
	createInvitationGroup,
} from "../controllers/invitation.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import { validateData } from "../middlewares/validation.middleware";
import {
	AcceptInvitationGroupSchema,
	CreateInvitationGroupSchema,
} from "../schemas/invite.schema";

const router: Router = Router();

router.post(
	"/groups/:groupId/invite",
	[authenticate, validateData(CreateInvitationGroupSchema)],
	createInvitationGroup
);
router.get(
	"/groups/accept",
	[authenticate, validateData(AcceptInvitationGroupSchema)],
	acceptInvitation
);

export default router;
