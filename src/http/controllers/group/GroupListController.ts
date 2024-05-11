import { Response } from 'express';
import { RequestStatuses } from '@enums';
import GroupListService from '@services/group/GroupListService';
import AuthRequest from '@requests/AuthRequest';
import CreateGroupRequest from '@requests/group/list/CreateGroupRequest';
import DeleteGroupRequest from '@requests/group/list/DeleteGroupRequest';
import UpdateGroupRequest from '@requests/group/list/UpdateGroupRequest';

export default class GroupListController {
    public static async getOwnedGroups(req: AuthRequest, res: Response) {
        const user = req.user;

        const result = await GroupListService.getOwnedGroups(user.id);

        return res.status(RequestStatuses.OK).json({ body: result });
    }

    public static async createGroup(req: CreateGroupRequest, res: Response) {
        const user = req.user;
        const { description, name } = req.body;

        const result = await GroupListService.createGroup({
            description,
            name,
            user
        });

        return res.status(RequestStatuses.Created).json({ body: result });
    }

    public static async deleteGroup(req: DeleteGroupRequest, res: Response) {
        const user = req.user;
        const groupId = req.params.groupId as unknown as number;

        await GroupListService.deleteGroup(groupId, user.id);

        return res.status(RequestStatuses.Accepted).json();
    }

    public static async updateGroup(req: UpdateGroupRequest, res: Response) {
        const user = req.user;
        const groupId = req.params.groupId;
        const { description, name } = req.body;

        const result = await GroupListService.updateGroup({
            description,
            name,
            user,
            groupId
        });

        return res.status(RequestStatuses.Created).json({ body: result });
    }
}
