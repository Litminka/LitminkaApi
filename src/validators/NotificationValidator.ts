import { validateArrayId, validateBool } from "./BaseValidator";
import { PeriodValidator } from "./PeriodValidator";

export const ReadNotificationsValidation = (): any[] => {
    return [
        validateArrayId('id')
    ]
};

export const GetNotificationsValidation = (): any[] => {
    return [
        PeriodValidator()
    ]
};

export const GetUserNotificationsValidation = (): any[] => {
    return [
        PeriodValidator(), 
        validateBool('isRead')
    ]
};
