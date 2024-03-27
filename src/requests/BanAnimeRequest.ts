import prisma from "@/db";
import { Permissions, RequestAuthTypes } from "@/ts/enums";
import { paramIdValidator } from "@/validators/ParamBaseValidator";
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
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            paramIdValidator({
                fieldName: "animeId",
                message: baseMsg.valueNotInRange
            })
        ];
    }
}