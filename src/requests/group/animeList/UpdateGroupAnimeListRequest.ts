import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";
import { AddToGroupListValidation } from "@validators/GroupListValidator";

export default class UpdateGroupAnimeListRequest extends AuthRequest {

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserWithOwnedGroups(userId);
    }

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return AddToGroupListValidation();
    }
}