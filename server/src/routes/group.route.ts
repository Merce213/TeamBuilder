import { Router } from "express";
import {
	createGroup,
	deleteGroup,
	getGroupById,
	getUserGroups,
	updateGroup,
} from "../controllers/group.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import {
	checkAuthorization,
	checkGroupAccess,
} from "../middlewares/authorization.middleware";
import { validateData } from "../middlewares/validation.middleware";
import {
	CreateGroupSchema,
	DeleteGroupeSchema,
	GetGroupSchema,
	GetUserGroupsSchema,
	UpdateGroupSchema,
} from "../schemas/group.schema";

const router: Router = Router();

router.get(
	"/:userId/groups",
	[authenticate, validateData(GetUserGroupsSchema), checkAuthorization()],
	getUserGroups
);
router.post(
	"/:userId/groups",
	[authenticate, validateData(CreateGroupSchema), checkAuthorization()],
	createGroup
);
router.get(
	"/:userId/groups/:groupId",
	[authenticate, validateData(GetGroupSchema)],
	getGroupById
);
router.patch(
	"/:userId/groups/:groupId",
	[authenticate, validateData(UpdateGroupSchema), checkGroupAccess()],
	updateGroup
);
router.delete(
	"/:userId/groups/:groupId",
	[authenticate, validateData(DeleteGroupeSchema), checkGroupAccess()],
	deleteGroup
);

export default router;
