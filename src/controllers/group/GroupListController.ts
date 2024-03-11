import { Response } from "express";
import { RequestWithAuth, RequestWithUserOwnedGrous } from "../../ts";
import { RequestStatuses } from "../../ts/enums";
import prisma from "../../db";
import GroupListService from "../../services/group/GroupListService";

export default class GroupListController {

    public static async getOwnedGroups(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { ownedGroups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const result = await GroupListService.getOwnedGroups(id);

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async createGroup(req: RequestWithUserOwnedGrous, res: Response) {
        const user = req.auth.user;
        const { description, name } = req.body;

        const result = await GroupListService.createGroup({ description, name, user });

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async deleteGroup(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const groupId = req.params.groupId as unknown as number;

        await GroupListService.deleteGroup(groupId, user.id);

        return res.status(RequestStatuses.OK).json({ message: "group_deleted" });
    }

    public static async updateGroup(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { ownedGroups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const groupId = req.params.groupId as unknown as number;
        const { description, name } = req.body;

        const result = await GroupListService.updateGroup({ description, name, user, groupId });

        return res.status(RequestStatuses.OK).json(result);
    }
}