import { AuthRequest, AuthReq } from "@requests/AuthRequest";
import prisma from "@/db";
import { Integration, User, UserSettings } from "@prisma/client";

export interface IntegrationSettingsReq extends AuthReq {
    auth: {
        user: User & {
            integration: Integration,
            settings: UserSettings,
        },
        id: number,
        token: string,
    }
} 

export class IntegrationSettingsRequest extends AuthRequest {

    /**
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findWithIntegrationSettings(userId)
    }
}