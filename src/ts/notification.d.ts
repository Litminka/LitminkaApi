import { NotifyStatuses } from '@enums';

export interface Notification {
    animeId: number;
    status: NotifyStatuses;
    groupId?: number;
    episode?: number;
}

export interface UserNotification extends Notification {
    userId: number;
}
