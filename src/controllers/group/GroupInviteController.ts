import { Response } from "express";
import { RequestWithUser, RequestWithUserGroupInvites, RequestWithUserOwnedGroups } from "../../ts";
import { RequestStatuses } from "../../ts/enums";
import GroupInviteService from "../../services/group/GroupInviteService";

export default class GroupInviteController {
    public static async getInvites(req: RequestWithUser, res: Response) {
        const user = req.auth.user;

        const userInvites = await GroupInviteService.getUserInvites(user.id);

        return res.status(RequestStatuses.OK).json(userInvites);
    }

    public static async inviteUser(req: RequestWithUserOwnedGroups, res: Response) {
        const user = req.auth.user;

        const groupId = req.params.groupId as unknown as number;
        const { userId } = req.body;

        await GroupInviteService.inviteUser({ owner: user, userId, groupId })

        return res.status(RequestStatuses.Created).json();
    }

    public static async deleteInvite(req: RequestWithUserOwnedGroups, res: Response) {
        const user = req.auth.user;

        const groupId = req.params.groupId as unknown as number;
        const { userId } = req.body;

        await GroupInviteService.deleteInvite({ owner: user, userId, groupId });

        return res.status(RequestStatuses.OK).json({ message: "user_uninvited" });
    }

    public static async acceptInvite(req: RequestWithUserGroupInvites, res: Response) {
        const user = req.auth.user;

        const inviteId = req.params.inviteId as unknown as number;
        const modifyList: boolean | undefined = req.body.modifyList;

        await GroupInviteService.acceptInvite({ user, inviteId, modifyList });

        return res.status(RequestStatuses.OK).json({ data: "invite_accepted" });
    }

    public static async denyInvite(req: RequestWithUserGroupInvites, res: Response) {
        const user = req.auth.user;

        const inviteId = req.params.inviteId as unknown as number;

        await GroupInviteService.denyInvite({ user, inviteId });

        return res.status(RequestStatuses.OK).json({ data: "invite_denied" });
    }
}