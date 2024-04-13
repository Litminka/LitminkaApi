import ForbiddenError from '@/errors/clienterrors/ForbiddenError';
import * as jwt from 'jsonwebtoken';
import { Permissions } from '@/ts/enums';
import { UserWithPermissions } from '@/ts';
import prisma from '@/db';

interface SignedTokens {
    token: string;
    refreshToken: string;
}

export default class TokenService {
    public static async refreshToken(token?: string) {
        if (!token) throw new ForbiddenError('No token provided');
        const result = token.split(' ')[1];
        let userToken, userRefreshToken;
        const tokens = await new Promise((resolve, reject) => {
            jwt.verify(result, process.env.REFRESH_TOKEN_SECRET!, async function (err, decoded) {
                if (<any>err instanceof jwt.TokenExpiredError)
                    throw new ForbiddenError('Token expired');
                if (err) return reject(new ForbiddenError('Failed to authenticate token'));

                const auth = <any>decoded;
                if (!auth) return reject(new ForbiddenError('Failed to authenticate token'));

                const user = await prisma.user.findUserWithTokensAndPermissions(auth.id);
                if (!user) return reject(new ForbiddenError('Failed to authenticate token'));

                if (
                    !user.sessionTokens.some((token) => {
                        return token.token === auth.token;
                    })
                )
                    return reject(new ForbiddenError('Unauthorized'));

                const { token, refreshToken } = TokenService.signTokens(user!, auth.token);
                userToken = token;
                userRefreshToken = refreshToken;
                resolve({
                    token: userToken,
                    refreshToken: userRefreshToken
                });
            });
        });

        return tokens;
    }

    public static signTokens(user: UserWithPermissions, sessionToken: string): SignedTokens {
        const signObject = {
            id: user.id,
            bot: user.role.permissions.some((perm) => {
                return perm.name == Permissions.ApiServiceBot;
            }),
            token: sessionToken
        };

        const token = jwt.sign(signObject, process.env.TOKEN_SECRET!, {
            expiresIn: process.env.TOKEN_LIFE
        });
        const refreshToken = jwt.sign(
            { id: user.id, token: sessionToken },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: process.env.REFRESH_TOKEN_LIFE }
        );
        return {
            token,
            refreshToken
        };
    }

    public static async getTokens(id: number) {
        return await prisma.sessionToken.findMany({
            where: {
                userId: id
            }
        });
    }

    public static async deleteTokens(id: number, currentToken: string, deleteTokens?: string[]) {
        const isSpecificDelete = deleteTokens !== undefined;
        if (isSpecificDelete) {
            const index = deleteTokens.indexOf(currentToken);
            if (index > -1) {
                deleteTokens.splice(index, 1);
            }
        }

        return await prisma.sessionToken.deleteMany({
            where: {
                userId: id,
                token:
                    isSpecificDelete ?
                        {
                            in: deleteTokens
                        }
                    :   {
                            notIn: [currentToken]
                        }
            }
        });
    }
}
