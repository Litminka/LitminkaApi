import { Response } from "express";
import { RequestWithAuth } from "../../ts";
import { RequestStatuses } from "../../ts/enums";
import { prisma } from "../../db";
import GroupListService from "../../services/group/GroupListService";
import { Prisma } from "@prisma/client";

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

    public static async deleteGroup(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const group_id = req.params.group_id as unknown as number;

        await GroupListService.deleteGroup(group_id, user.id);

        return res.status(RequestStatuses.OK).json({ message: "group_deleted" });
    }

    public static async updateGroup(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_groups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const group_id = req.params.group_id as unknown as number;
        const { description, name } = req.body;

        const result = await GroupListService.updateGroup({ description, name, user, group_id });

        return res.status(RequestStatuses.OK).json(result);
    }
}