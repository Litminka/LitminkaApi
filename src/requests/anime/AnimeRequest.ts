import prisma from "@/db";
import { paramIntValidator } from "@validators/ParamBaseValidator";
import OptionalRequest from "@requests/OptionalRequest";
import { baseMsg } from "@/ts/messages"

export default class AnimeRequest extends OptionalRequest {

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserByIdWithIntegration(userId);
    }

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            paramIntValidator({
                fieldName: "animeId",
                message: baseMsg.valueNotInRange
            })
        ])
    }
}