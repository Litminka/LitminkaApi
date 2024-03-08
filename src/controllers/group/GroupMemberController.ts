import { Response } from "express";
import { RequestWithAuth } from "../../ts";
import { RequestStatuses } from "../../ts/enums";
import { prisma } from "../../db";
import GroupMemberService from "../../services/group/GroupMemberService";

export default class GroupMemberController {
    public static async getMemberGroup(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const result = await GroupMemberService.getMemberGroup(id);

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async getMembers(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const group_id = req.params.group_id as unknown as number;

        const result = await GroupMemberService.getGroupMembers(id, group_id);

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async leaveGroup(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const group_id = req.params.group_id as unknown as number;

        await GroupMemberService.leaveGroup(id, group_id);

        return res.status(RequestStatuses.OK).json({message: "you_left_the_group"});
    }

    public static async updateState(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const group_id = req.params.group_id as unknown as number;
        const modifyList = req.body.modifyList as unknown as boolean;

        await GroupMemberService.updateState({ user_id: id, group_id, modifyList });

        return res.status(RequestStatuses.OK).json({message: "member_updated"});
    }

    public static async kickUser() {

    }

}