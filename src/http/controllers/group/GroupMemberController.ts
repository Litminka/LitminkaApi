import { Response } from 'express';
import { RequestStatuses } from '@enums';
import GroupMemberService from '@services/group/GroupMemberService';
import AuthRequest from '@requests/AuthRequest';
import GroupMemberRequest from '@requests/group/member/GroupMemberRequest';
import KickGroupMemberRequest from '@requests/group/member/KickGroupMemberRequest';
import UpdateGroupMemberRequest from '@requests/group/member/UpdateGroupMemberRequest';

export default class GroupMemberController {
    public static async getMemberGroup(req: AuthRequest, res: Response) {
        const user = req.user;

        const result = await GroupMemberService.getMemberGroup(user.id);

        return res.status(RequestStatuses.OK).json({ body: result });
    }

    public static async getMembers(req: GroupMemberRequest, res: Response) {
        const user = req.user;

        const groupId = req.params.groupId;

        const result = await GroupMemberService.getGroupMembers(user.id, groupId);

        return res.status(RequestStatuses.OK).json({ body: result });
    }

    public static async leaveGroup(req: GroupMemberRequest, res: Response) {
        const user = req.user;

        const groupId = req.params.groupId;

        await GroupMemberService.leaveGroup(user.id, groupId);

        return res.status(RequestStatuses.Accepted);
    }

    public static async updateState(req: UpdateGroupMemberRequest, res: Response) {
        const user = req.user;

        const groupId = req.params.groupId as unknown as number;
        const modifyList = req.body.modifyList as unknown as boolean;

        await GroupMemberService.updateState({
            userId: user.id,
            groupId,
            modifyList
        });

        return res.status(RequestStatuses.Created);
    }

    public static async kickUser(req: KickGroupMemberRequest, res: Response) {
        const user = req.user;

        const groupId = req.params.groupId as unknown as number;
        const kickId = req.body.userId as unknown as number;

        await GroupMemberService.kickUser({ user, groupId, kickId });

        return res.status(RequestStatuses.Accepted);
    }
}
