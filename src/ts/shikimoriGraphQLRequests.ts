export const getAnimeWithRelationsQuery = `query($ids: String) { 
    animes(ids: $ids, limit: 50) {
        id 
        name 
        russian 
        licenseNameRu
        licensors 
        english 
        japanese 
        kind 
        rating 
        score 
        status 
        episodes 
        episodesAired 
        airedOn { year month day date } 
        releasedOn { year month day date } 
        season 
        isCensored 
        description 
        genres { id name russian kind } 
        franchise 
        poster { id originalUrl mainUrl } 
        related { 
            id 
            relationRu 
            anime { 
                id 
                name 
                russian 
                licenseNameRu
                licensors 
                english 
                japanese 
                kind 
                rating 
                score 
                status 
                episodes 
                episodesAired 
                airedOn { year month day date } 
                releasedOn { year month day date } 
                genres { id name russian kind } 
                season 
                isCensored 
                description 
                franchise 
                poster { id originalUrl mainUrl } 
                } 
            } 
        } 
    }`;

export const getAnimeBySeasonQuery = `query($season: SeasonString, $page: Int) { 
    animes(season: $season, page: $page, limit: 50) {
        id 
        name 
        russian 
        licenseNameRu
        licensors 
        english 
        japanese 
        kind 
        rating 
        score 
        status 
        episodes 
        episodesAired 
        airedOn { year month day date } 
        releasedOn { year month day date } 
        season 
        isCensored 
        description 
        genres { id name russian kind } 
        franchise 
        poster { id originalUrl mainUrl } 
    }
}`;

export const getAnimeByPageQuery = `query($page: Int) { 
    animes(page: $page, limit: 50) {
        id 
        name 
        russian 
        licenseNameRu
        licensors 
        english 
        japanese 
        kind 
        rating 
        score 
        status 
        episodes 
        episodesAired 
        airedOn { year month day date } 
        releasedOn { year month day date } 
        season 
        isCensored 
        description 
        genres { id name russian kind } 
        franchise 
        poster { id originalUrl mainUrl } 
    }
}`;

export const getAnimeWithoutRelationQuery = `query($ids: String) { 
    animes(ids: $ids, limit: 50) {
        id 
        name 
        russian 
        licenseNameRu
        licensors 
        english 
        japanese 
        kind 
        rating 
        score 
        status 
        episodes 
        episodesAired 
        airedOn { year month day date } 
        releasedOn { year month day date } 
        season 
        isCensored 
        description 
        genres { id name russian kind } 
        franchise 
        poster { id originalUrl mainUrl } 
    }
}`;

export const getGenresQuery = `{
    genres(entryType: Anime) {
      id,
      kind,
      name,
      russian
    }
}`;
