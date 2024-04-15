type WatchListAnimeStatus =
    | 'planned'
    | 'watching'
    | 'rewatching'
    | 'completed'
    | 'on_hold'
    | 'dropped';

export interface WatchListFilters {
    isFavorite?: boolean;
    statuses?: WatchListAnimeStatus[];
    ratings?: number[];
}
export interface AddToList {
    status: WatchListAnimeStatus;
    watchedEpisodes: number;
    rating: number;
    isFavorite: boolean;
}

export interface AddWithAnime extends AddToList {
    animeId: number;
}
