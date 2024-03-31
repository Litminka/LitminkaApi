import { EditWatchListValidator } from "@validators/WatchListValidator";
import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";

export default class EditWatchListRequest extends AuthRequest {
    
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
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return EditWatchListValidator();
    }
}