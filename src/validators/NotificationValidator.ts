import { validateBodyArrayId, validateBodyBool } from "@validators/BaseValidator";
import { softPeriodValidator } from "@validators/PeriodValidator";

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
