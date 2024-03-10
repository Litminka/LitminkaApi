import { Response } from "express";
import { RequestWithAuth } from "../../ts";
import { RequestStatuses } from "../../ts/enums";
import prisma from "../../db";
import GroupInviteService from "../../services/group/GroupInviteService";

export default class GroupInviteController {
    public static async getInvites(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const userInvites = await GroupInviteService.getUserInvites(id);

        return res.status(RequestStatuses.OK).json(userInvites);
    }

    public static async inviteUser(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { ownedGroups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const groupId = req.params.groupId as unknown as number;
        const { userId } = req.body;

        await GroupInviteService.inviteUser({ owner: user, userId, groupId })

        return res.status(RequestStatuses.Created).json();
    }

    public static async deleteInvite(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { ownedGroups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const groupId = req.params.groupId as unknown as number;
        const { userId } = req.body;

        await GroupInviteService.deleteInvite({ owner: user, userId, groupId });

        return res.status(RequestStatuses.OK).json({ message: "user_uninvited" });
    }

    public static async acceptInvite(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { groupInvites: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const inviteId = req.params.inviteId as unknown as number;
        const modifyList: boolean | undefined = req.body.modifyList;

        await GroupInviteService.acceptInvite({ user, inviteId, modifyList });

        return res.status(200).json({ data: "invite_accepted" });
    }

    public static async denyInvite(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { groupInvites: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const inviteId = req.params.inviteId as unknown as number;

        await GroupInviteService.denyInvite({ user, inviteId });

        return res.status(200).json({ data: "invite_denied" });
    }
}