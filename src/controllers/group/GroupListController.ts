import { Response } from "express";
import { RequestWithAuth } from "../../ts";
import { RequestStatuses } from "../../ts/enums";
import { prisma } from "../../db";
import GroupListService from "../../services/group/GroupListService";

export default class GroupListController {

    public static async getOwnedGroups(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_groups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const result = await GroupListService.getOwnedGroups(id);

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async createGroup(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_groups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const { description, name } = req.body;

        const result = await GroupListService.createGroup({ description, name, user });

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async deleteGroup() {

    }

    public static async updateGroup() {
        
    }
}