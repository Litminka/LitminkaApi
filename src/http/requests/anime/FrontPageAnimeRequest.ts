import { ValidationChain } from "express-validator";
import { bodyBoolValidator } from "@/validators/BodyBaseValidator";
import { OptionalReq, OptionalRequest } from "../OptionalRequest";
import prisma from "@/db";
import { Permission, Role, User } from "@prisma/client";

export interface FrontPageAnimeReq extends OptionalReq {
    auth?: {
        user: User & {
            role: Role & {
                permissions: Permission[]
            }
        },
        id: number,
        token: string,
    }
    body: {
        withCensored: boolean,
    }
}

export default class FrontPageAnimeRequest extends OptionalRequest {
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
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        return [
            bodyBoolValidator("withCensored", { defValue: false })
        ]
    }
}