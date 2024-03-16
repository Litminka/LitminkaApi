import { validateBodyArrayId, validateBodyBool } from "@validators/BaseValidator";
import { softPeriodValidator } from "@validators/PeriodValidator";

export const ReadNotificationsValidator = (): any[] => {
    return [
        validateBodyArrayId('id')
    ]
};

export const GetNotificationsValidator = (): any[] => {
    return [
        softPeriodValidator('period')
    ]
};

export const GetUserNotificationsValidator = (): any[] => {
    return [
        softPeriodValidator('period'),
        validateBodyBool('isRead')
    ]
};
