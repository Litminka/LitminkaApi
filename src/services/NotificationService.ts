import Notifications from "../models/Notificatons";
import { Notify, UserNotify } from "../ts";
import { NotifyStatuses } from "../ts/enums";

export default class NotificationService {
    constructor() {

    }
    
    public static async notifyUserRelease(user_id: number, anime_id: number) {
        const notify: UserNotify = { user_id, anime_id, status: NotifyStatuses.AnimeRelease }
        return this._notifyUserEpisode(notify)
    }

    public static async notifyUserEpisode(user_id: number, anime_id: number, group_id: number, episode: number) {
        const notify: UserNotify = { user_id, anime_id, status: NotifyStatuses.EpisodeRelease, group_id, episode }
        return this._notifyUserEpisode(notify)
    }

    public static async notifyUserFinalEpisode(user_id: number, anime_id: number, group_id: number, episode: number) {
        const notify: UserNotify = { user_id, anime_id, status: NotifyStatuses.FinalEpisodeReleased, group_id, episode }
        return this._notifyUserEpisode(notify)
    }

    public static async notifyRelease(anime_id: number) {
        const notify: Notify =  { anime_id, status: NotifyStatuses.AnimeRelease }
        return this._notifyEpisode(notify)
    }

    public static async notifyEpisode(anime_id: number, group_id: number, episode: number) {
        const notify: Notify =  { anime_id, status: NotifyStatuses.EpisodeRelease, episode }
        return this._notifyEpisode(notify)
    }

    public static async notifyFinalEpisode(anime_id: number, group_id: number, episode: number) {
        const notify: Notify =  { anime_id, status: NotifyStatuses.FinalEpisodeReleased, episode }
        return this._notifyEpisode(notify)
    }
        
    private static async _notifyUserEpisode(notify: UserNotify){
        return Notifications.createUserAnimeNotifications(notify);
    }

    private static async _notifyEpisode(notify: Notify){
        return Notifications.createAnimeNotifications(notify);
    }
}