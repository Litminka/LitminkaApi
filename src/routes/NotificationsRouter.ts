import { Router } from 'express';
import NotificationsController from '../controllers/NotificationsController';
import { auth } from '../middleware/auth';
import { FollowValidation, UnFollowValidation } from '../validators/FollowValidator';
import { wrap } from '../middleware/errorHandler';
import exp from 'constants';
const router = Router();

// router.post("/:anime_id", [auth, ...FollowValidation()], wrap(FollowController.follow));

router.get("/:user_id", [auth], wrap(NotificationsController.userNotifications))
router.get("", [auth], wrap(NotificationsController.globalNotifications))

export { router as notificationsRouter }