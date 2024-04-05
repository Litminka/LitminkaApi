import { AnimeList, AnimeTranslation, GroupList, GroupListInvites, Integration, Permission, Role, SessionToken, User } from "@prisma/client";
import { Request } from "express";
import { FollowTypes, NotifyStatuses, RequestStatuses } from "@/ts/enums";
import { ValidationError, Location } from "express-validator";
import { ErrorMessage } from "express-validator/src/base";

export declare type AdditionalValidationError = {
    type: string;
    additional: object;
    location: Location;
    path: string;
    value: any;
    msg: any;
} | ValidationError

export declare type ValidatorErrorMessage = {
    msg: string,
    [key: string]: any
} | ErrorMessage

export interface RequestWithBot extends Request {
    auth?: {
        user: undefined
        id: number,
        bot?: boolean
        token: string
    },
}

export interface RequestWithAuth extends Request {
    auth?: {
        user: undefined;
        id: number;
    };
}

export interface RequestWithUser extends Request {
    auth: {
        user: User,
        id: number
    }
}

export interface RequestWithTokens extends Request {
    auth: {
        user: UserWithTokens,
        id: number,
        token: string
    }
}

interface RoleWithPermissions extends Role {
    permissions: Permission[]
}

type UserWithTokens = User & {
    sessionTokens: SessionToken[]
}

export interface RequestWithUserOwnedGroups extends Request {
    auth: {
        user: User & {
            ownedGroups: GroupList[]
        },
        id: number
    }
}

export interface RequestWithUserGroupInvites extends Request {
    auth: {
        user: User & {
            groupInvites: GroupListInvites[]
        },
        id: number
    }
}

export interface RequestWithTokenAndCode extends Request {
    query: {
        token: string,
        code: string
    }
}


export interface RequestWithUserAnimeList extends Request {
    auth: {
        user: User & {
            animeList: AnimeList | null
        }
        id: number,
    }
}

export type UserWithPermissions = User & {
    role: RoleWithPermissions
}

export interface ShikimoriWhoAmI {
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

export interface ListFilters {
    statuses?: watchListStatus[],
    ratings?: number[],
    isFavorite?: boolean
}

export type watchListStatus =
    | "planned"
    | "watching"
    | "rewatching"
    | "completed"
    | "on_hold"
    | "dropped";
type animeKind =
    | "tv"
    | "movie"
    | "ova"
    | "ona"
    | "special"
    | "music"
    | "tv_13"
    | "tv_24"
    | "tv_48s";
type animeStatus = "released" | "ongoing" | "anons";
type pgRating = "none" | "g" | "pg" | "pg_13" | "r" | "r_plus" | "rx";
type pgCapitalizedRating = "None" | "G" | "PG" | "PG_13" | "R" | "R+" | "RX";
interface ratingAmount {
    name: number;
    value: number;
}
interface ratingStatus {
    name: string;
    value: number;
}
export interface ShikimoriWatchList {
    id: number;
    user_id: number;
    target_id: number;
    target_type: string;
    score: number;
    status: watchListStatus;
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
    rating: pgRating;
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
    rates_scores_stats: ratingAmount[];
    rates_statuses_stats: ratingStatus[];
    updated_at: string;
    next_episode_at: string | null;
    fansubbers: string[];
    fandubbers: string[];
    licensors: string[];
    genres: genre[];
    studios: studio[];
    videos: video[];
    screenshots: screenshot[];
    user_rate: null;
}

interface screenshot {
    original: string;
    preview: string;
}
interface genre {
    id: number;
    name: string;
    russian: string;
    kind: "anime";
}
interface video {
    url: string;
    id: number;
    image_url: string;
    player_url: string;
    name: string;
    kind: string;
    hosting: string;
}
interface studio {
    id: number;
    name: string;
    filtered_name: string;
    real: boolean;
    image: string;
}

export interface AddToList {
    status: watchListStatus;
    watchedEpisodes: number;
    rating: number;
    isFavorite: boolean;
}

export interface AddWithAnime extends AddToList {
    animeId: number
}

export interface Follow {
    groupName: string;
    type: FollowTypes.Follow | FollowTypes.Announcement
}

export interface DeleteFollow {
    groupName?: string
}

export interface options {
    method: string;
    body?: any;
}

export type info = {
    translation?: AnimeTranslation,
    userId: number
}
export type followType = {
    anime: {
        shikimoriId: number;
    };
    info: info[]
    status: string;
}

export interface Notify {
    animeId: number,
    status: NotifyStatuses,
    groupId?: number,
    episode?: number,
}

export interface UserNotify extends Notify {
    userId: number
}

export type RequestTypes = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface LoginUser {
    password: string,
    login: string
}

export interface CreateUser extends LoginUser {
    email: string,
    name?: string,
}

export interface FollowAnime {
    userId: number,
    animeId: number,
    status: FollowTypes,
    translationId?: number
    translationGroupName?: string
}

export type UserWithIntegration = User & {
    integration: Integration | null
}

export interface minmax {
    min: number,
    max?: number
}