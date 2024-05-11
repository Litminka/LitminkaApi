import { ValidationChain } from 'express-validator';
import { bodyBoolValidator } from '@/validators/BodyBaseValidator';
import OptionalRequest from '@requests/OptionalRequest';
import prisma from '@/db';

export default class FrontPageAnimeRequest extends OptionalRequest {
    public body!: {
        withCensored: boolean;
    };

    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */

    public async getUser(userId: number) {
        return await prisma.user.findUserByIdWithRolePermission(userId);
    }

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [bodyBoolValidator('withCensored', { defValue: false })];
    }
}

export const frontPageAnimeReq = new FrontPageAnimeRequest().send();
