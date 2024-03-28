import { body } from "express-validator";
import prisma from "@/db";
import AuthRequest from "@requests/AuthRequest";
import { bodyArrayValidator, bodyBoolValidator, bodyIntValidator, bodyStringValidator } from "@/validators/BodyBaseValidator";
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
            bodyArrayValidator({
                fieldName: "statuses",
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator({
                fieldName: "statuses.*",
                message: searchMsg.maxLengthExceeded
            }).isIn(Object.values(WatchListStatuses)),

            bodyArrayValidator({
                fieldName: "ratings",
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyIntValidator({
                fieldName: "ratings.*",
                typeParams: { min: 0, max: 10 },
                message: baseMsg.valueNotInRange
            }),

            bodyBoolValidator({
                fieldName: "isFavorite",
                message: baseMsg.requiresBoolean
            })
        ])
    }
}