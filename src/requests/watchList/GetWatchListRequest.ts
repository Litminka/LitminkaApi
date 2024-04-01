import { ValidationChain } from "express-validator";
import AuthRequest from "@requests/AuthRequest";
import { bodyArrayValidator, bodyBoolValidator, bodyIntValidator, bodyStringValidator } from "@validators/BodyBaseValidator";
import { baseMsg, searchMsg } from "@/ts/messages";
import { WatchListStatuses } from "@/ts/enums";

export default class GetWatchListRequest extends AuthRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyArrayValidator("statuses").optional(),
            bodyStringValidator("statuses.*", {
                message: searchMsg.maxLengthExceeded
            }).isIn(Object.values(WatchListStatuses)),

            bodyArrayValidator("ratings", {
                message: searchMsg.maxArraySizeExceeded
            }).optional(),

            bodyIntValidator("ratings.*", {
                typeParams: { min: 0, max: 10 },
                message: baseMsg.valueNotInRange
            }),

            bodyBoolValidator("isFavorite", {
                message: baseMsg.valueMustBeBool
            }).optional()
        ]
    }
}