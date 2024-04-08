import { Prisma } from "@prisma/client";
import prisma from "@/db";

const extention = Prisma.defineExtension({
    name: "RefreshTokenModel",
    model: {
        sessionToken: {
            async createToken(refreshToken: string, id: number) {
                await prisma.sessionToken.create({
                    data: {
                        token: refreshToken,
                        userId: id
                    }
                });
            }
        }
    }
});

export { extention as SessionTokenExt };