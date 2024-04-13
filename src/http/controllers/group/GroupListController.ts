import { Response } from 'express';
import { RequestStatuses } from '@enums';
import GroupListService from '@services/group/GroupListService';
import { AuthReq } from '@requests/AuthRequest';
import { CreateGroupReq } from '@requests/group/list/CreateGroupRequest';
import { DeleteGroupReq } from '@requests/group/list/DeleteGroupRequest';
import { UpdateGroupReq } from '@requests/group/list/UpdateGroupRequest';

export default class GroupListController {
    public static async getOwnedGroups(req: AuthReq, res: Response) {
        const user = req.auth.user;

        const result = await GroupListService.getOwnedGroups(user.id);

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async createGroup(req: CreateGroupReq, res: Response) {
        const user = req.auth.user;
        const { description, name } = req.body;

        const result = await GroupListService.createGroup({
            description,
            name,
            user
        });

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async deleteGroup(req: DeleteGroupReq, res: Response) {
        const user = req.auth.user;
        const groupId = req.params.groupId as unknown as number;

        await GroupListService.deleteGroup(groupId, user.id);

        return res.status(RequestStatuses.OK).json({ message: 'group_deleted' });
    }

    public static async updateGroup(req: UpdateGroupReq, res: Response) {
        const user = req.auth.user;
        const groupId = req.params.groupId;
        const { description, name } = req.body;

        const result = await GroupListService.updateGroup({
            description,
            name,
            user,
            groupId
        });

        return res.status(RequestStatuses.OK).json(result);
    }
}
