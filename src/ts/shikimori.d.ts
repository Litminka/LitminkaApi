import { WatchListAnimeStatus } from './watchList';

interface Screenshot {
    original: string;
    preview: string;
}

interface Genre {
    id: number;
    name: string;
    russian: string;
    kind: 'anime';
}

interface Video {
    url: string;
    id: number;
    image_url: string;
    player_url: string;
    name: string;
    kind: string;
    hosting: string;
}

interface Studio {
    id: number;
    name: string;
    filtered_name: string;
    real: boolean;
    image: string;
}

type PgRating = 'none' | 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'rx';
type PgCapitalizedRating = 'None' | 'G' | 'PG' | 'PG_13' | 'R' | 'R+' | 'RX';
interface RatingAmount {
    name: number;
    value: number;
}
interface RatingStatus {
    name: string;
    value: number;
}

export interface ShikimoriGraphAnimeRequest {
    data: {
        animes: ShikimoriAnimeWithRelation[];
    };
}

export interface ShikimoriGraphAnimeWithoutRelationRequest {
    data: {
        animes: ShikimoriGraphAnime[];
    };
}

export interface ShikimoriGraphAnime {
    id: string;
    name: string;
    russian: string | null;
    licenseNameRu: string | null;
    licensors: string[];
    english: string | null;
    japanese: string | null;
    kind: animeKind;
    rating: animeRating | null;
    score: number | null;
    status: animeStatus | null;
    episodes: number;
    episodesAired: number;
    airedOn: shikimoriDate;
    releasedOn: shikimoriDate;
    season: string | null;
    isCensored: boolean;
    description: string | null;
    genres: shikimoriGenre[];
    franchise: string | null;
    poster: shikimoriPoster | null;
}

export interface ShikimoriListResponse {
    id: number;
    user_id: number;
    target_id: number;
    target_type: 'Anime';
    score: number;
    status: WatchListAnimeStatus;
    rewatches: number;
    episodes: number;
    volumes: number;
    chapters: number;
    text?: string;
    text_html: string;
    created_at: string;
    updated_at: string;
}

export interface ShikimoriAnimeWithRelation extends ShikimoriGraphAnime {
    related: ShikimoriRelation[];
}

export interface ShikimoriAnimeOptionalRelation extends ShikimoriGraphAnime {
    related?: ShikimoriRelation[];
}

interface shikimoriList {
    episodes: number;
    score?: number;
    status: WatchListAnimeStatus;
    animeId: number;
}

interface ratingAmount {
    name: number;
    value: number;
}
interface ratingStatus {
    name: string;
    value: number;
}

type genreKind = 'demographic' | 'genre' | 'theme';
type pgRating = 'none' | 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'rx';
type pgCapitalizedRating = 'None' | 'G' | 'PG' | 'PG_13' | 'R' | 'R+' | 'RX';
type animeKind = 'tv' | 'movie' | 'ova' | 'ona' | 'special' | 'tv_special' | 'music' | 'pv' | 'cm';
type animeRating = 'none' | 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'rx';
type animeStatus = 'anons' | 'ongoing' | 'released' | 'announced';

interface shikimoriDate {
    year?: number;
    month?: number;
    day?: number;
    date?: string;
}

interface shikimoriPoster {
    id: string;
    originalUrl: string;
    mainUrl: string;
}

interface shikimoriGenre {
    id: number;
    kind: genreKind;
    name: string;
    russian: string;
}

interface ShikimoriRelation {
    id: number;
    relationRu: string;
    anime: ShikimoriGraphAnime | null;
}

export interface ShikimoriProfile {
    id: number;
    nickname: string;
    /**
     * Url to avatar image
     */
    avatar: string;
    image: {
        x160: string;
        x148: string;
        x80: string;
        x64: string;
        x48: string;
        x32: string;
        x16: string;
    };
    last_online_at: string;
    url: string;
    name: string | null;
    sex: string;
    website: string | null;
    birth_on: string | null;
    full_years: number | null;
    locale: string;
}

export interface ShikimoriWatchList {
    id: number;
    user_id: number;
    target_id: number;
    target_type: string;
    score: number;
    status: WatchListAnimeStatus;
    rewatches: number;
    episodes: number;
    volumes: number;
    chapters: number;
    text: string | null;
    text_html: string;
    created_at: string;
    updated_at: string;
}

export interface ShikimoriAnime {
    id: number;
    /**
     * Assumed to be an english name
     */
    name: string;
    /**
     * Russian name
     */
    russian: string;
    image: {
        original: string;
        preview: string;
        x96: string;
        x48: string;
    };
    /**
     * Uri starting from https://shikimori.one
     */
    url: string;
    kind: animeKind;
    /**
     * Although type is a string, it's a float
     */
    score: string;
    status: animeStatus;
    /**
     * Maximum episodes
     */
    episodes: number;
    /**
     * Current episodes
     */
    episodes_aired: number;
    /**
     * First episode aired
     */
    aired_on: string;
    /**
     * Last episode aired
     */
    released_on: string;
}

export interface ShikimoriAnimeFull {
    id: number;
    name: string;
    russian: string;
    image: {
        original: string;
        preview: string;
        x96: string;
        x48: string;
    };
    url: string;
    kind: animeKind;
    /**
     * Although type is a string, it's float number
     */
    score: string;
    status: animeStatus;
    episodes: number;
    episodes_aired: number;
    /**
     * First episode aired
     */
    aired_on: string;
    /**
     * Last episodes aired
     */
    released_on: string;
    rating: PgRating;
    english: string[];
    japanese: string[];
    synonyms: string[];
    license_name_ru: string | null;
    duration: number;
    description: string;
    description_html: string;
    description_source: string | null;
    franchise: string | null;
    favoured: boolean;
    anons: boolean;
    ongoing: boolean;
    thread_id: number;
    topic_id: number;
    myanimelist_id: number;
    rates_scores_stats: RatingAmount[];
    rates_statuses_stats: RatingStatus[];
    updated_at: string;
    next_episode_at: string | null;
    fansubbers: string[];
    fandubbers: string[];
    licensors: string[];
    genres: Genre[];
    studios: Studio[];
    videos: Video[];
    screenshots: Screenshot[];
    user_rate: null;
}
