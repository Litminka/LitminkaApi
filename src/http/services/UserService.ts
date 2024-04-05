import prisma from "@/db";
import UnauthorizedError from "@errors/clienterrors/UnauthorizedError";
import { Encrypt } from "@/helper/encrypt";
import { CreateUser, LoginUser } from "@/ts";
import crypto from "crypto";
import TokenService from "@services/TokenService";

export default class UserService {

    constructor() {

    }

    public static async create(userData: CreateUser) {
        userData.password = await Encrypt.cryptPassword(userData.password);
        return await prisma.user.createUser(userData);
    }

    public static async login(userData: LoginUser) {
        const { login, password } = userData;
        const user = await prisma.user.findUserByLogin(login) ?? undefined;

        // protection against time based attack
        if (!await Encrypt.comparePassword(password, user?.password ?? '')) throw new UnauthorizedError("Login or password incorrect");
        if (!user) throw new UnauthorizedError("Login or password incorrect");

        const { id } = user;

        const sessionToken = crypto.randomUUID();

        const { token, refreshToken } = TokenService.signTokens(user, sessionToken);

        await prisma.sessionToken.createToken(sessionToken, id);

        return {
            token, refreshToken
        }
    }
}