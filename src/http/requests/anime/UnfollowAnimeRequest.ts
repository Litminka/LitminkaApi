import { ValidationChain } from 'express-validator';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import { bodyStringValidator } from '@/validators/BodyBaseValidator';
import AuthRequest from '@requests/AuthRequest';

export default class UnFollowAnimeRequest extends AuthRequest {
    public body!: {
        groupName?: string;
    };
    public params!: {
        animeId: number;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [paramIntValidator('animeId'), bodyStringValidator('groupName').optional()];
    }
}

export const unFollowAnimeReq = new UnFollowAnimeRequest().send();
