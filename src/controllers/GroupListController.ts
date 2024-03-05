import { Response } from "express";
import { RequestWithAuth } from "../ts";
import { RequestStatuses } from "../ts/enums";
import { prisma } from "../db";
import BaseError from "../errors/BaseError";

export default class GroupListController {

    public static async getOwnedGroups(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_lists: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const result = await prisma.group_list.findMany({
            where: {
                owner_id: id
            }
        });

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async createGroup(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_lists: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const { description, name } = req.body;

        if (user.owned_lists.length >= 10) {
            throw new BaseError('too_many_groups', {
                status: RequestStatuses.BadRequest
            });
        }

        const result = await prisma.group_list.create({
            data: {
                description,
                name,
                owner_id: id,
            }
        })

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async getInvites(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const userInvites = await prisma.group_list_invites.findMany({
            where: {
                user_id: id
            }
        })

        return res.status(RequestStatuses.OK).json(userInvites);
    }

    public static async inviteUser(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_lists: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const list_id = req.params.group_id as unknown as number;
        const { user_id } = req.body;

        if (user_id === id) {
            throw new BaseError('cant_invite_yourself', {
                status: RequestStatuses.UnprocessableContent
            })
        }

        if (!user.owned_lists.some(list => list.id === list_id)) {
            throw new BaseError('not_found', {
                status: RequestStatuses.NotFound
            })
        }

        await prisma.user.findFirstOrThrow({ where: { id: user_id } });

        const userInvite = await prisma.group_list_invites.findMany({
            where: {
                list_id,
                user_id
            }
        })
        

        if (userInvite.length > 0) {
            throw new BaseError('user_already_invited', {
                status: RequestStatuses.UnprocessableContent
            })
        }

        await prisma.group_list_invites.create({
            data: { list_id, user_id }
        });

        return res.status(RequestStatuses.Created).json();
    }
}