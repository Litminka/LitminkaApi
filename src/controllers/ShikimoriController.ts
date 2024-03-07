import { User, Integration, Shikimori_Link_Token } from "@prisma/client";
import { Request, Response } from "express";
import crypto from "crypto";
import { RequestWithAuth, ServerError, ShikimoriWhoAmI } from "../ts/index";
import ShikimoriApiService from "../services/ShikimoriApiService";
import { prisma } from '../db';
import { RequestStatuses } from "../ts/enums";

export default class ShikimoriController {
    static async generateLink(req: RequestWithAuth, res: Response): Promise<Object> {
        const { id }: { id: number } = req.auth!;
        const token: string = crypto.randomBytes(24).toString('hex');
        await prisma.shikimori_Link_Token.upsert({
            where: { user_id: id },
            update: {
                token: token,
            },
            create: {
                user_id: id,
                token: token,
            }
        })
        const link = `${process.env.app_url}/shikimori/link?token=${token}`;
        return res.status(RequestStatuses.OK).json({
            link: `https://shikimori.one/oauth/authorize?client_id=${process.env.shikimori_client_id}&redirect_uri=${link}&response_type=code&scope=user_rates`
        });
    }

    static async link(req: Request, res: Response): Promise<Object> {
        const { token, code } = req.query;
        if (typeof token !== "string") return res.status(RequestStatuses.Unauthorized).json({
            message: "Query param token must be string",
        });
        if (typeof code !== "string") return res.status(RequestStatuses.Unauthorized).json({
            message: "Query param code must be string",
        });
        await prisma.shikimori_Link_Token.update({
            where: { token },
            data: {
                user: {
                    update: {
                        integration: {
                            upsert: {
                                create: {
                                    shikimori_code: code
                                },
                                update: {
                                    shikimori_code: code
                                }
                            }
                        }
                    }
                }
            }
        })
        const user = await prisma.user.findFirstOrThrow({
            where: {
                shikimori_link: {
                    token
                }
            },
            include: {
                integration: true,
                shikimori_link: true
            }
        });

        const shikimoriapi = new ShikimoriApiService(user);
        const profile = await shikimoriapi.getProfile();
        if (!profile) return res.status(RequestStatuses.Unauthorized).json({
            message: 'User does not have shikimori integration'
        });

        if (profile.reqStatus === RequestStatuses.InternalServerError) return res.status(RequestStatuses.InternalServerError).json({ message: "Server error" });

        const integrated = await prisma.integration.findFirst({
            where: {
                shikimori_id: (<ShikimoriWhoAmI>profile).id
            }
        });
        // fix if user integrated another account
        if (integrated) {
            await prisma.integration.update({
                where: {
                    user_id: user.id
                },
                data: {
                    shikimori_code: null,
                    shikimori_token: null,
                    shikimori_refresh_token: null,
                    shikimori_id: null,
                }
            });
            return res.status(RequestStatuses.Unauthorized).json({
                message: "Account already linked",
            });
        }
        await prisma.integration.update({
            where: {
                user_id: user.id
            },
            data: {
                shikimori_id: (<ShikimoriWhoAmI>profile).id
            }
        });
        await prisma.shikimori_Link_Token.delete({
            where: { token }
        });
        return res.status(RequestStatuses.OK).json({
            message: "Account linked!"
        })
    }

    static async unlink(req: RequestWithAuth, res: Response) {
        const { id } = req.auth!;
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id
            },
            include: {
                integration: true,
                shikimori_link: true
            },
        });
        await prisma.user.update({
            where: { id },
            data: {
                integration: {
                    update: {
                        shikimori_code: null,
                        shikimori_id: null,
                        shikimori_refresh_token: null,
                        shikimori_token: null,
                    }
                }
            }
        })
        return res.status(RequestStatuses.OK).json({
            message: "Account unlinked",
            link: "https://shikimori.one/oauth/applications/672",
        })
    }

    static async getProfile(req: RequestWithAuth, res: Response): Promise<Object> {
        const { id } = req.auth!;
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id
            },
            include: {
                integration: true,
                shikimori_link: true
            },
        });
        const shikimori = new ShikimoriApiService(user);
        const result: ShikimoriWhoAmI | ServerError | false = await shikimori.getProfile();
        if (!result) return res.status(RequestStatuses.Unauthorized).json({
            message: 'User does not have shikimori integration'
        });
        if (result.reqStatus === RequestStatuses.InternalServerError) return res.status(RequestStatuses.InternalServerError).json({ message: "Server error" });
        return res.status(RequestStatuses.OK).json(result);
    }
}