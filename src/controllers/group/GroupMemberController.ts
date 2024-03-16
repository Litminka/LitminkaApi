import { Response } from "express";
import { RequestWithUser, RequestWithUserOwnedGroups } from "@/ts";
import { RequestStatuses } from "@/ts/enums";
import GroupMemberService from "@services/group/GroupMemberService";

export default class GroupMemberController {
    public static async getMemberGroup(req: RequestWithUser, res: Response) {
        const user = req.auth.user;

        const result = await GroupMemberService.getMemberGroup(user.id);

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async getMembers(req: RequestWithUser, res: Response) {
        const user = req.auth.user;

        const groupId = req.params.groupId as unknown as number;

        const result = await GroupMemberService.getGroupMembers(user.id, groupId);

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async leaveGroup(req: RequestWithUser, res: Response) {
        const user = req.auth.user;

        const groupId = req.params.groupId as unknown as number;

        await GroupMemberService.leaveGroup(user.id, groupId);

        return res.status(RequestStatuses.OK).json({ message: "you_left_the_group" });
    }

    public static async updateState(req: RequestWithUser, res: Response) {
        const user = req.auth.user;

        const groupId = req.params.groupId as unknown as number;
        const modifyList = req.body.modifyList as unknown as boolean;

        await GroupMemberService.updateState({ userId: user.id, groupId, modifyList });

        return res.status(RequestStatuses.OK).json({ message: "member_updated" });
    }

    public static async kickUser(req: RequestWithUserOwnedGroups, res: Response) {
        const user = req.auth.user;

        const groupId = req.params.groupId as unknown as number;
        const kickId = req.body.userId as unknown as number;

        await GroupMemberService.kickUser({ user, groupId, kickId });

        return res.status(RequestStatuses.OK).json({ message: "user_kicked" });
    }

}