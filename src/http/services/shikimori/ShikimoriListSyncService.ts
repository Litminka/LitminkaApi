import prisma from '@/db';
import ShikimoriApiService from '@services/shikimori/ShikimoriApiService';
import { shikimoriList } from '@/ts/shikimori';
import { shikimoriListUpdateQueue } from '@/queues/queues';
import { UserWithIntegrationSettings } from '@/ts/user';

export default class ShikimoriListSyncService {
    public static async addOrUpdateList(userId: number, list: shikimoriList) {
        const user = await prisma.user.findUserById(userId, {
            integration: true,
            shikimoriLink: true
        });
        const anime = await prisma.anime.findFirstOrThrow({
            where: {
                shikimoriId: list.animeId
            }
        });

        if (!user) return;
        if (!user.integration?.shikimoriCanChangeList) return;

        const shikimoriApi = new ShikimoriApiService(user);

        const response = await shikimoriApi.addOrUpdateList(list);
        const { id } = response;

        await prisma.animeList.updateMany({
            where: {
                animeId: anime.id,
                userId: user.id
            },
            data: {
                shikimoriId: id
            }
        });
    }

    public static async deleteList(userId: number, shikimoriId: number) {
        const user = await prisma.user.findUserById(userId, {
            integration: true,
            shikimoriLink: true
        });

        if (!user) return;
        if (!user.integration?.shikimoriCanChangeList) return;

        const shikimoriApi = new ShikimoriApiService(user);
        await shikimoriApi.deleteListEntry(shikimoriId);
    }

    public static createAddUpdateJob(user: UserWithIntegrationSettings, list: shikimoriList) {
        if (
            !user ||
            !user.integration ||
            !user.integration.shikimoriCanChangeList ||
            !user.settings ||
            !user.settings?.shikimoriExportList
        )
            return;

        shikimoriListUpdateQueue.add(
            'shikimoriListUpdate',
            { userId: user.id, list, type: 'add-update' },
            {
                removeOnComplete: 10,
                removeOnFail: 100
            }
        );
    }
    public static createDeleteJob(user: UserWithIntegrationSettings, id: number) {
        if (
            !user ||
            !user.integration ||
            !user.integration.shikimoriCanChangeList ||
            !user.settings ||
            !user.settings?.shikimoriExportList
        )
            return;

        shikimoriListUpdateQueue.add(
            'shikimoriListUpdate',
            { userId: user.id, shikimoriId: id, type: 'delete' },
            {
                removeOnComplete: 10,
                removeOnFail: 100
            }
        );
    }
}
