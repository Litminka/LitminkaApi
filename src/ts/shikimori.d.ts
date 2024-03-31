import { watchListStatus } from "."

export interface ShikimoriGraphAnimeRequest {
    data: {
        animes: ShikimoriAnimeWithRelation[]
    }
}

export interface ShikimoriGraphAnimeWithoutRelationRequest {
    data: {
        animes: ShikimoriGraphAnime[]
    }
}

export interface ShikimoriGraphAnime {
    id: string,
    name: string,
    russian: string | null,
    licenseNameRu: string | null,
    licensors: string[],
    english: string | null,
    japanese: string | null,
    kind: animeKind,
    rating: animeRating | null,
    score: number | null,
    status: animeStatus | null,
    episodes: number,
    episodesAired: number,
    airedOn: shikimoriDate,
    releasedOn: shikimoriDate
    season: string | null,
    isCensored: boolean,
    description: string | null,
    genres: shikimoriGenre[],
    franchise: string | null,
    poster: shikimoriPoster | null
}

export interface ShikimoriListResponse {
    id: number,
    user_id: number,
    target_id: number,
    target_type: "Anime",
    score: number,
    status: watchListStatus,
    rewatches: number,
    episodes: number,
    volumes: number,
    chapters: number,
    text?: string,
    text_html: string,
    created_at: string,
    updated_at: string
}

export interface ShikimoriAnimeWithRelation extends ShikimoriGraphAnime {
    related: ShikimoriRelation[]
}

export interface ShikimoriAnimeOptionalRelation extends ShikimoriGraphAnime {
    related?: ShikimoriRelation[]
}

interface shikimoriList {
    episodes: number,
    score?: number,
    status: watchListStatus,
    animeId: number,
}

type genreKind = "demographic" | "genre" | "theme"

type animeKind = "tv" | "movie" | "ova" | "ona" | "special" | "tv_special" | "music" | "pv" | "cm"

type animeRating = "none" | "g" | "pg" | "pg_13" | "r" | "r_plus" | "rx"

type animeStatus = "anons" | "ongoing" | "released"

interface shikimoriDate {
    year?: number,
    month?: number,
    day?: number,
    date?: string
}

interface shikimoriPoster {
    id: string,
    originalUrl: string,
    mainUrl: string
}

interface shikimoriGenre {
    id: number,
    kind: genreKind,
    name: string,
    russian: string
}

interface ShikimoriRelation {
    id: number,
    relationRu: string,
    anime: ShikimoriGraphAnime | null
}
