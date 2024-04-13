import { Response } from 'express';
import { RequestStatuses } from '@/ts/enums';
import GroupInviteService from '@services/group/GroupInviteService';
import { AuthReq } from '@requests/AuthRequest';
import { SendInviteReq } from '@requests/group/invite/SendInviteRequest';
import { DeleteInviteReq } from '@requests/group/invite/DeleteInviteRequest';
import { AcceptInviteReq } from '@requests/group/invite/AcceptInviteRequest';
import { DenyInviteReq } from '@requests/group/invite/DenyInviteRequest';

export default class GroupInviteController {
    public static async getInvites(req: AuthReq, res: Response) {
        const user = req.auth.user;

        const userInvites = await GroupInviteService.getUserInvites(user.id);

        return res.status(RequestStatuses.OK).json(userInvites);
    }

    public static async inviteUser(req: SendInviteReq, res: Response) {
        const user = req.auth.user;

        const groupId = req.params.groupId;
        const { userId } = req.body;

        await GroupInviteService.inviteUser({ owner: user, userId, groupId });

        return res.status(RequestStatuses.Created).json();
    }

    public static async deleteInvite(req: DeleteInviteReq, res: Response) {
        const user = req.auth.user;

        const groupId = req.params.groupId;
        const { userId } = req.body;

        await GroupInviteService.deleteInvite({ owner: user, userId, groupId });

        return res.status(RequestStatuses.OK).json({ message: 'user_uninvited' });
    }

    public static async acceptInvite(req: AcceptInviteReq, res: Response) {
        const user = req.auth.user;

        const inviteId = req.params.inviteId;
        const modifyList = req.body.modifyList;

        await GroupInviteService.acceptInvite({ user, inviteId, modifyList });

        return res.status(RequestStatuses.OK).json({ data: 'invite_accepted' });
    }

    public static async denyInvite(req: DenyInviteReq, res: Response) {
        const user = req.auth.user;

        const inviteId = req.params.inviteId;

        await GroupInviteService.denyInvite({ user, inviteId });

        return res.status(RequestStatuses.OK).json({ data: 'invite_denied' });
    }
}
