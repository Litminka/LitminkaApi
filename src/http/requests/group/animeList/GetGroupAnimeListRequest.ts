import { ValidationChain } from "express-validator";
import { GroupReq, GroupRequest } from "@requests/group/GroupRequest";
import { WatchListStatuses } from "@/ts/enums";
import { bodyArrayValidator, bodyStringValidator, bodyIntValidator, bodyBoolValidator } from "@validators/BodyBaseValidator";
import { paramIntValidator } from "@validators/ParamBaseValidator";
import { queryIntValidator } from "@validators/QueryBaseValidator";

export interface GetGroupAnimeListReq extends GroupReq {
    params: {
        groupId: number
    },
    body: {
        statuses?: WatchListStatuses[],
        ratings?: number[],
        isFavorite?: boolean
    },
    query: {
        page: number,
        pageLimit: number
    }
}

export class GetGroupAnimeListRequest extends GroupRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            paramIntValidator("groupId"),

            bodyArrayValidator("statuses").optional(),
            bodyStringValidator("statuses.*").isIn(Object.values(WatchListStatuses)),

            bodyArrayValidator("ratings").optional(),
            bodyIntValidator("ratings.*", { typeParams: { min: 0, max: 10 } }),

            bodyBoolValidator("isFavorite").optional(),

            queryIntValidator("page", {
                defValue: 1,
                typeParams: { min: 1 },
            }),
            queryIntValidator("pageLimit", {
                defValue: 25,
                typeParams: { min: 1, max: 125 },
            }),
        ];
    }
}