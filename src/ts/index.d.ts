import { Anime, Anime_translation } from "@prisma/client";
import { Request } from "express";
import { Headers } from "node-fetch";
import { FollowTypes, RequestStatuses } from "./enums";

export interface RequestWithAuth extends Request {
    auth?: {
        id: number;
    };
}

export interface ShikimoriWhoAmI {
    id: number;
    reqStatus: number;
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

type watchListStatus =
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
    reqStatus: number;
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
    reqStatus: number;
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
    reqStatus: number;
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
    watched_episodes: number;
    rating: number;
    is_favorite: boolean;
}

export interface Follow {
    group_name: string;
    type: FollowTypes.Follow | FollowTypes.Announcement
}

export interface DeleteFollow {
    group_name?: string
}

export interface options {
    method: string;
    headers: Headers;
    body?: any;
}

export interface ServerError {
    reqStatus: RequestStatuses.InternalServerError;
    message: string;
}

export type info = {
    translation?: Anime_translation,
    user_id: number
}
export type followType = {
    anime: {
        shikimori_id: number;
    };
    info: info[]
    status: string;
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

