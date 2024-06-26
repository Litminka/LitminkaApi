import { Anime, AnimeTranslation } from '@prisma/client';
import { animeKind, animeStatus, pgCapitalizedRating } from '@/ts/shikimori';
import { RequestStatuses } from '@enums';

export interface _KodikAnimeRequest {
    time: string;
    total: number;
    reqStatus: RequestStatuses.OK;
    results: _KodikAnime[];
}

export interface _KodikAnimeFullRequest {
    time: string;
    total: number;
    reqStatus: RequestStatuses.OK;
    shikimori_request: number;
    results: _KodikAnimeFull[];
}

export interface _KodikAnimeWithTranslationsRequest {
    time: string;
    total: number;
    reqStatus: RequestStatuses.OK;
    result: KodikAnime | null;
}

export interface _KodikAnimeWithTranslationsFullRequest {
    time: string;
    total: number;
    reqStatus: RequestStatuses.OK;
    shikimori_request: number;
    result: KodikAnimeFull | null;
}

export interface KodikGenresRequest {
    time: string;
    total: number;
    reqStatus: RequestStatuses.OK;
    results: KodikGenre[];
}

interface KodikGenre {
    title: string;
    count: number;
}

interface _KodikAnime {
    id: string;
    type: 'anime-serial';
    link: string;
    title: string;
    title_orig: string;
    other_title: string;
    translation: _translation;
    year: number;
    last_season: number;
    last_episode: number;
    episodes_count: number;
    shikimori_id: string;
    blocked_countries: string[];
    created_at: string;
    updated_at: string;
    screenshots: string[];
}

interface KodikAnimeWithTranslationsN {
    id: string;
    type: 'anime-serial';
    link: string;
    title: string;
    title_orig: string;
    other_title: string;
    year: number;
    last_season: number;
    last_episode: number;
    shikimori_id: string;
    blocked_countries: string[];
    created_at: string;
    updated_at: string;
    screenshots: string[];
    translations: translation[];
}
type KodikAnime = Omit<KodikAnimeWithTranslationsN, 'translation'>;

interface _KodikAnimeFull extends _KodikAnime {
    material_data: {
        title: string;
        anime_title: string;
        title_en: string;
        other_titles: string[];
        other_titles_en: string[];
        other_titles_jp: string[];
        anime_license_name: string;
        anime_licensed_by: string[];
        anime_kind: animeKind;
        anime_status: animeStatus;
        year: number;
        anime_description: string;
        poster_url: string;
        screenshots: string[];
        duration: number;
        countries: string[];
        anime_genres: string[];
        anime_studios: string[];
        shikimori_rating: number;
        shikimori_votes: number;
        premiere_world: string;
        aired_at: string;
        released_at: string;
        rating_mpaa: pgCapitalizedRating;
        minimal_age: number;
        episodes_total: number;
        episodes_aired: number;
        actors: string[];
        directors: string[];
        producers: string[];
        writers: string[];
        composers: string[];
        editors: string[];
        designers: string[];
        operators: string[];
    };
}

interface KodikAnimeWithTranslationsFullN extends _KodikAnimeFull, KodikAnime {}
type KodikAnimeFull = Omit<KodikAnimeWithTranslationsFullN, 'translation'>;

export type _translation = {
    id: number;
    title: string;
    type: 'voice' | 'subtitles';
};

export type animeWithTranslation = Anime & {
    animeTranslations: AnimeTranslation[];
};

export type translation = {
    /**
     * id of the group
     */
    id: number;
    title: string;
    type: 'voice' | 'subtitles';
    episodes_count: number;
    link: string;
};
