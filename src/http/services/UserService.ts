import prisma from "@/db";
import UnauthorizedError from "@errors/clienterrors/UnauthorizedError";
import { Encrypt } from "@/helper/encrypt";
import { CreateUser, LoginUser, UserWithIntegration } from "@/ts";
import crypto from "crypto";
import TokenService from "@services/TokenService";
import UnprocessableContentError from "@/errors/clienterrors/UnprocessableContentError";

interface UpdateSettings {
    siteTheme?: string,
    watchListMode?: string,
    watchListAddAfterEpisodes?: number,
    watchListAskAboutRating?: boolean,
    showCensoredContent?: boolean,
    shikimoriImportList?: boolean,
    notifyDiscord?: boolean,
    notifyTelegram?: boolean,
    notifyVK?: boolean,
    notifyPush?: boolean,
}

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

    public static async updateSettings(user: UserWithIntegration, data: UpdateSettings) {

        const { siteTheme, showCensoredContent, watchListMode, watchListAskAboutRating, watchListAddAfterEpisodes } = data;

        const { notifyDiscord, notifyTelegram, notifyVK, notifyPush, shikimoriImportList } = data;

        if (notifyDiscord && !user.integration?.discordId) throw new UnprocessableContentError("no_discord_integration");

        if (notifyVK && !user.integration?.vkId) throw new UnprocessableContentError("no_vk_integration");

        if (notifyTelegram && !user.integration?.telegramId) throw new UnprocessableContentError("no_telegram_integration");

        if (shikimoriImportList && (!user.integration?.shikimoriId || !user.integration?.shikimoriCanChangeList)) {
            throw new UnprocessableContentError("no_shikimori_integration");
        }

        await prisma.userSettings.update({
            where: { userId: user.id },
            data: {
                siteTheme, showCensoredContent, watchListMode, watchListAddAfterEpisodes, watchListAskAboutRating,
                notifyDiscord, notifyPush, notifyTelegram, notifyVK, shikimoriImportList
            }
        })

    }
}