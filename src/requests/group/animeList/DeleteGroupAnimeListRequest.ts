import AuthRequest from "../../AuthRequest";
import prisma from "../../../db";
import { GroupListIdValidation } from "../../../validators/GroupListValidator";
import { DeleteFromWatchListValidation } from "../../../validators/WatchListValidator";

export default class DeleteGroupAnimeListRequest extends AuthRequest {

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
        return [...GroupListIdValidation(), ...DeleteFromWatchListValidation()];
    }
}