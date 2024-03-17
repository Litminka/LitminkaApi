import { Response } from "express";
import { RequestWithUser, RequestWithUserOwnedGroups } from "@/ts";
import { RequestStatuses } from "@/ts/enums";
import GroupListService from "@services/group/GroupListService";

interface createGroup {
    description: string,
    name: string,
}

interface updateGroup {
    description?: string,
    name?: string
}

export default class GroupListController {

    public static async getOwnedGroups(req: RequestWithUserOwnedGroups, res: Response) {
        const user = req.auth.user;

        const result = await GroupListService.getOwnedGroups(user.id);

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async createGroup(req: RequestWithUserOwnedGroups, res: Response) {
        const user = req.auth.user;
        const { description, name } = req.body as createGroup;

        const result = await GroupListService.createGroup({ description, name, user });

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async deleteGroup(req: RequestWithUser, res: Response) {
        const user = req.auth.user;
        const groupId = req.params.groupId as unknown as number;

        await GroupListService.deleteGroup(groupId, user.id);

        return res.status(RequestStatuses.OK).json({ message: "group_deleted" });
    }

    public static async updateGroup(req: RequestWithUserOwnedGroups, res: Response) {
        const user = req.auth.user;
        const groupId = req.params.groupId as unknown as number;
        const { description, name } = req.body as updateGroup;

        const result = await GroupListService.updateGroup({ description, name, user, groupId });

        return res.status(RequestStatuses.OK).json(result);
    }
}