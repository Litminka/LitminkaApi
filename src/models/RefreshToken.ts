import { Prisma } from "@prisma/client";
import prisma from "../db";

const extention = Prisma.defineExtension({
    name: "RefreshTokenModel",
    model: {
        refreshToken: {
            async createToken(refreshToken: string, id: number) {
                prisma.refreshToken.create({
                    data: {
                        token: refreshToken,
                        userId: id
                    }
                });
            }
        }
    }
})

export { extention as RefreshTokenExt }