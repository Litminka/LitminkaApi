import prisma from '@/db';
import { Encrypt } from '@/helper/encrypt';
import { CreateUser, LoginUser, UserProfile } from '@/ts/user';
import crypto from 'crypto';
import TokenService from '@services/TokenService';
import UnprocessableContentError from '@/errors/clienterrors/UnprocessableContentError';

interface UpdateSettings {
    siteTheme?: string;
    watchListMode?: string;
    watchListAddAfterEpisodes?: number;
    watchListAskAboutRating?: boolean;
    watchListAutoAdd?: boolean;
    watchListIgnoreOptionForLessEpisodes?: boolean;
    watchListWatchedPercentage?: number;
    watchListUnsubAfterDrop?: boolean;
    showCensoredContent?: boolean;
    shikimoriExportList?: boolean;
    notifyDiscord?: boolean;
    notifyTelegram?: boolean;
    notifyVK?: boolean;
    notifyPush?: boolean;
}

export default class UserService {
    constructor() {}

    public static async create(userData: CreateUser) {
        userData.password = await Encrypt.cryptPassword(userData.password);
        return await prisma.user.createUser(userData);
    }

    public static async login(userData: LoginUser) {
        const { login, password } = userData;
        const user = (await prisma.user.findUserByLogin(login)) ?? undefined;

        // protection against time based attack
        if (!(await Encrypt.comparePassword(password, user?.password ?? '')))
            throw new UnprocessableContentError('Login or password incorrect');
        if (!user) throw new UnprocessableContentError('Login or password incorrect');

        const { id } = user;

        const sessionToken = crypto.randomUUID();

        const { token, refreshToken } = TokenService.signTokens(user, sessionToken);

        await prisma.sessionToken.createToken(sessionToken, id);

        return {
            token,
            refreshToken
        };
    }

    public static async profile() {}

    public static async updateSettings(user: UserProfile, data: UpdateSettings) {
        const {
            siteTheme,
            showCensoredContent,
            watchListMode,
            watchListAskAboutRating,
            watchListAddAfterEpisodes,
            watchListAutoAdd,
            watchListIgnoreOptionForLessEpisodes,
            watchListWatchedPercentage,
            watchListUnsubAfterDrop
        } = data;

        const { notifyDiscord, notifyTelegram, notifyVK, notifyPush, shikimoriExportList } = data;

        if (notifyDiscord && !user.integration?.discordId)
            throw new UnprocessableContentError('no_discord_integration');

        if (notifyVK && !user.integration?.vkId)
            throw new UnprocessableContentError('no_vk_integration');

        if (notifyTelegram && !user.integration?.telegramId)
            throw new UnprocessableContentError('no_telegram_integration');

        if (
            shikimoriExportList &&
            (!user.integration?.shikimoriId || !user.integration?.shikimoriCanChangeList)
        ) {
            throw new UnprocessableContentError('no_shikimori_integration');
        }

        return prisma.userSettings.upsert({
            where: { userId: user.id },
            update: {
                siteTheme,
                showCensoredContent,
                watchListMode,
                watchListAddAfterEpisodes,
                watchListAskAboutRating,
                watchListAutoAdd,
                watchListIgnoreOptionForLessEpisodes,
                watchListWatchedPercentage,
                watchListUnsubAfterDrop,
                notifyDiscord,
                notifyPush,
                notifyTelegram,
                notifyVK,
                shikimoriExportList
            },
            create: {
                userId: user.id,
                siteTheme,
                showCensoredContent,
                watchListMode,
                watchListAddAfterEpisodes,
                watchListAskAboutRating,
                watchListAutoAdd,
                watchListIgnoreOptionForLessEpisodes,
                watchListWatchedPercentage,
                watchListUnsubAfterDrop,
                notifyDiscord,
                notifyPush,
                notifyTelegram,
                notifyVK,
                shikimoriExportList
            }
        });
    }
}
