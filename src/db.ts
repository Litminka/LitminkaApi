import { PrismaClient } from '@prisma/client'
import { FollowExt } from './models/Follow'
import { AnimeExt } from './models/Anime';
import { IntegrationExt } from './models/Integration';
import { AnimeNotificationExt } from './models/AnimeNotificatons';
import { UserNotificationExt } from './models/AnimeUserNotifications';
import { AnimeListExt } from './models/AnimeList';
import { RefreshTokenExt } from './models/RefreshToken';
import { ShikimoriLinkTokenExt } from './models/ShikimoriLinkToken';
import { UserExt } from './models/User';

const prismaClientSingleton = () => {
    return new PrismaClient()
        .$extends(AnimeExt)
        .$extends(AnimeListExt)
        .$extends(AnimeNotificationExt)
        .$extends(UserNotificationExt)
        .$extends(FollowExt)
        .$extends(IntegrationExt)
        .$extends(RefreshTokenExt)
        .$extends(ShikimoriLinkTokenExt)
        .$extends(UserExt)
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export default prisma