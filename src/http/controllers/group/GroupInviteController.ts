import { Response } from 'express';
import { RequestStatuses } from '@enums';
import GroupInviteService from '@services/group/GroupInviteService';
import AuthRequest from '@requests/AuthRequest';
import SendInviteRequest from '@requests/group/invite/SendInviteRequest';
import DeleteInviteRequest from '@requests/group/invite/DeleteInviteRequest';
import AcceptInviteRequest from '@requests/group/invite/AcceptInviteRequest';
import DenyInviteRequest from '@requests/group/invite/DenyInviteRequest';

export default class GroupInviteController {
    public static async getInvites(req: AuthRequest, res: Response) {
        const user = req.user;

        const userInvites = await GroupInviteService.getUserInvites(user.id);

        return res.status(RequestStatuses.OK).json({ body: userInvites });
    }

    public static async inviteUser(req: SendInviteRequest, res: Response) {
        const user = req.user;

        const groupId = req.params.groupId;
        const { userId } = req.body;

        await GroupInviteService.inviteUser({ owner: user, userId, groupId });

        return res.status(RequestStatuses.Created).json();
    }

    public static async deleteInvite(req: DeleteInviteRequest, res: Response) {
        const user = req.user;

        const groupId = req.params.groupId;
        const { userId } = req.body;

        await GroupInviteService.deleteInvite({ owner: user, userId, groupId });

        return res.status(RequestStatuses.Accepted).json();
    }

    public static async acceptInvite(req: AcceptInviteRequest, res: Response) {
        const user = req.user;

        const inviteId = req.params.inviteId;
        const modifyList = req.body.modifyList;

        await GroupInviteService.acceptInvite({ user, inviteId, modifyList });

        return res.status(RequestStatuses.Accepted).json();
    }

    public static async denyInvite(req: DenyInviteRequest, res: Response) {
        const user = req.user;

        const inviteId = req.params.inviteId;

        await GroupInviteService.denyInvite({ user, inviteId });

        return res.status(RequestStatuses.Accepted).json();
    }
}
