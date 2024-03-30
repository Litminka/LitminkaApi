import { body } from "express-validator";
import prisma from "@/db";
import AuthRequest from "@requests/AuthRequest";
import { bodyArrayOptionalValidator, bodyArrayValidator, bodyBoolValidator, bodyIntValidator, bodyStringValidator } from "@/validators/BodyBaseValidator";
import { baseMsg, searchMsg } from "@/ts/messages";
import { WatchListStatuses } from "@/ts/enums";

export default class GetWatchListRequest extends AuthRequest {

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserById(userId);
    }

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            bodyArrayOptionalValidator({
                fieldName: "statuses",
                ifNotTypeParamsMessage: searchMsg.maxArraySizeExceeded
            }),
            bodyStringValidator({
                fieldName: "statuses.*",
                ifNotTypeParamsMessage: searchMsg.maxLengthExceeded
            }).isIn(Object.values(WatchListStatuses)),

            bodyArrayOptionalValidator({
                fieldName: "ratings",
                ifNotTypeParamsMessage: searchMsg.maxArraySizeExceeded
            }),
            bodyIntValidator({
                fieldName: "ratings.*",
                typeParams: { min: 0, max: 10 },
                ifNotTypeParamsMessage: baseMsg.valueNotInRange
            }),

            bodyBoolValidator({
                fieldName: "isFavorite",
                ifNotTypeParamsMessage: baseMsg.requiresBoolean
            })
        ])
    }
}