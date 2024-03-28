export enum FollowTypes {
    Follow = "follow",
    Announcement = "announcement"
}

export enum AnimeStatuses {
    Announced = "anons",
    Released = "released",
    Ongoing = "ongoing"
}

export enum AnimeSeasons {
    Winter = "winter",
    Spring = "spring",
    Summer = "summer",
    Fall = "fall"
}

export enum AnimePgaRatings {
    G = "G",
    PG = "PG",
    PG_13 = "PG-13",
    R = "R",
    R_plus = "R+",
    RX = "RX"
}

export enum AnimeMediaTypes {
    TV = "tv",
    TV_Special = "tv_special",
    Special = "special",
    ONA = "ona",
    OVA = "ova",
    Movie = "movie",
}

export enum NotifyStatuses {
    AnimeRelease = "anime_released",
    EpisodeRelease = "episode_released",
    FinalEpisodeReleased = "final_episode_released"
}

export enum AnimeListStatuses {
    planned = "planned",
    watching = "watching",
    rewatching = "rewatching",
    completed = "completed",
    on_hold = "on_hold",
    dropped = "dropped"
}

export enum RequestStatuses {
    //Information responses
    Continue = 100,
    SwitchingProtocols = 101,
    Processing = 102,
    EarlyHints = 103,
    //Successful responses
    OK = 200,
    Created = 201,
    Accepted = 202,
    NonAuthoritativeInformation = 203,
    NoContent = 204,
    ResetContent = 205,
    PartialContent = 206,
    MultiStatus = 207,
    AlreadyReported = 208,
    ImUsed = 226,
    //Redirection messages
    MultipleChoices = 300,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    NotModified = 304,
    //UseProxy = 305, deprecated
    //Unused = 306, deprecated
    TemporaryRedirect = 307,
    PermanentRedirect = 308,
    //Client error responses
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402, // experimental
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    ProxyAuthenticationRequired = 407,
    RequestTimeout = 408,
    Conflict = 409,
    Gone = 410,
    LengthRequired = 411,
    PreconditionFailed = 412,
    PayloadTooLarge = 413,
    URITooLong = 414,
    UnsupportedMediaType = 415,
    RangeNotSatisfiable = 416,
    ExpectationFailed = 417,
    ImATeapot = 418,
    MisdirectedRequest = 421,
    UnprocessableContent = 422,
    Locked = 423,
    FailedDependency = 424,
    TooEarly = 425, // experimental
    UpgradeRequired = 426,
    PreconditionRequired = 428,
    TooManyRequests = 429,
    RequesrHeaderFieldsTooLarge = 431,
    UnavailableForLegalReasons = 451,
    //Server error responses
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
    HTTPVersionNotSupported = 505,
    VariantAlsoNegotiates = 506,
    InsufficientStorage = 507,
    LoopDetected = 508,
    NotExtended = 510,
    NetowkrAuthenticationRequired = 511
}

export enum RequestAuthTypes {
    Auth,
    Optional,
    None
}

export enum Permissions {
    ManageAnime = "manage_anime",
    ViewLists = "view_lists",
    SyncShikimori = "sync_shikimori",
    ApiServiceBot = "api_service_bot",
}

export enum WatchListStatuses{
    Planned ="planned",
    Watching = "watching", 
    Rewatching = "rewatching",
    Completed = "completed", 
    OnHold = "on_hold",
    Dropped = "dropped"
}