import prisma from "@/db";
import AuthRequest from "@requests/AuthRequest";

export default class GetUserProfileRequest extends AuthRequest {

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserByIdWithRolePermission(userId);
    }

}