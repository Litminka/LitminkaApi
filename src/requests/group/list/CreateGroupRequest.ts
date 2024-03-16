import prisma from "@/db";
import { CreateGroupListValidator } from "@validators/GroupListValidator";
import AuthRequest from "@requests/AuthRequest";

export default class CreateGroupRequest extends AuthRequest {

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
        return CreateGroupListValidator();
    }
}