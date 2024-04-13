import { ValidationChain } from 'express-validator';
import { AuthReq, AuthRequest } from '@requests/AuthRequest';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import { bodyStringValidator } from '@/validators/BodyBaseValidator';

export interface UnFollowAnimeReq extends AuthReq {
    body: {
        groupName?: string;
    };
    params: {
        animeId: number;
    };
}

export class UnFollowAnimeRequest extends AuthRequest {
    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [paramIntValidator('animeId'), bodyStringValidator('groupName').optional()];
    }
}
