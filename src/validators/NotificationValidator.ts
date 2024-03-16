import { validateBodyArrayId, validateBodyBool } from "./BaseValidator";
import { softPeriodValidator } from "./PeriodValidator";

export const ReadNotificationsValidation = (): any[] => {
    return [
        validateBodyArrayId('id')
    ]
};

export const GetNotificationsValidation = (): any[] => {
    return [
        softPeriodValidator('period')
    ]
};

export const GetUserNotificationsValidation = (): any[] => {
    return [
        softPeriodValidator('period'),
        validateBodyBool('isRead')
    ]
};
