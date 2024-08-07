import GetAnimeRequest from '@requests/anime/GetAnimeRequest';
import Request from '@requests/Request';

export type SortAnimeSearchType = (typeof GetAnimeRequest.sortFields)[number];
export type SortListType = 'Name' | 'Rating' | 'ShikimoriRating' | 'ReleaseDate';
export type SortDirectionType = (typeof Request.sortDirections)[number];
