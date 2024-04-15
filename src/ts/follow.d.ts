import { AnimeTranslation } from '@prisma/client';
import { FollowTypes } from '@enums';

export interface FollowAnime {
    userId: number;
    animeId: number;
    status: FollowTypes;
    translationId?: number;
    translationGroupName?: string;
}

export type FollowInfo = {
    translation?: AnimeTranslation;
    userId: number;
};

export type FollowType = {
    anime: {
        shikimoriId: number;
    };
    info: FollowInfo[];
    status: string;
};
