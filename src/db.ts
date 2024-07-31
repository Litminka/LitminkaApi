import { PrismaClient } from '@prisma/client';
import { AnimeRelationExt } from '@models/AnimeRelations';
import { FollowExt } from '@models/Follow';
import { AnimeExt } from '@models/Anime';
import { IntegrationExt } from '@models/Integration';
import { AnimeListExt } from '@models/AnimeList';
import { SessionTokenExt } from '@models/SessionToken';
import { ShikimoriLinkTokenExt } from '@models/ShikimoriLinkToken';
import { UserExt } from '@models/User';

const prismaClientSingleton = () => {
    return new PrismaClient()
        .$extends(AnimeExt)
        .$extends(AnimeListExt)
        .$extends(FollowExt)
        .$extends(IntegrationExt)
        .$extends(SessionTokenExt)
        .$extends(ShikimoriLinkTokenExt)
        .$extends(UserExt)
        .$extends(AnimeRelationExt);
};

declare global {
    // eslint-disable-next-line no-var
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export default prisma;
