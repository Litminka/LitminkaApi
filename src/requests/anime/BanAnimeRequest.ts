import prisma from "@/db";
import { Permissions, RequestAuthTypes } from "@/ts/enums";
import { paramIntValidator } from "@/validators/ParamBaseValidator";
import Request from "@requests/Request";
import { baseMsg } from "@/ts/messages"

export default class BanAnimeRequest extends Request {

    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.Auth;

    protected permissions: string[] = [Permissions.ManageAnime];

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserByIdWithRolePermission(userId);
    }

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            paramIntValidator("animeId", {
                message: baseMsg.valueNotInRange
            })
        ])
    }
}