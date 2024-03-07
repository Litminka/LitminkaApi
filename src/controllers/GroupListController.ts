import { Response } from "express";
import { RequestWithAuth } from "../ts";
import { RequestStatuses } from "../ts/enums";
import { prisma } from "../db";
import BaseError from "../errors/BaseError";
import GroupListService from "../services/GroupListService";

export default class GroupListController {

    public static async getOwnedGroups(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_lists: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const result = await GroupListService.getOwnedGroups(id);

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async createGroup(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_lists: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const { description, name } = req.body;

        const result = await GroupListService.createGroup({ description, name, user });

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async getInvites(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const userInvites = await GroupListService.getUserInvites(id);

        return res.status(RequestStatuses.OK).json(userInvites);
    }

    public static async inviteUser(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_lists: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const list_id = req.params.group_id as unknown as number;
        const { user_id } = req.body;

        await GroupListService.inviteUser({ owner: user, idToInvite: user_id, list_id })

        return res.status(RequestStatuses.Created).json();
    }

    public static async acceptInvite(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { group_list_invites: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const invite_id = req.params.invite_id as unknown as number;
        const modifyList: boolean | undefined = req.body.modifyList;

        await GroupListService.acceptInvite({ user, invite_id, modifyList });

        return res.status(200).json({ data: "invite_accepted" });
    }

    public static async denyInvite(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { group_list_invites: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const invite_id = req.params.invite_id as unknown as number;

        await GroupListService.denyInvite({ user, invite_id });

        return res.status(200).json({ data: "invite_denied" });
    }
}