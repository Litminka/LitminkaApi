import { paramStringValidator } from '@/validators/ParamBaseValidator';
import { ValidationChain } from 'express-validator';
import prisma from '@/db';
import OptionalRequest from '@requests/OptionalRequest';

export default class GetSingleAnimeRequest extends OptionalRequest {
    public params!: {
        slug: string;
    };

    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    public async getUser(userId: number) {
        return await prisma.user.findUserByIdWithIntegration(userId);
    }
    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [paramStringValidator('slug', { typeParams: { max: 256 } })];
    }
}

export const getSingleAnimeReq = new GetSingleAnimeRequest().send();
