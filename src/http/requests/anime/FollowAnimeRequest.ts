import { ValidationChain } from 'express-validator';
import AuthRequest from '@requests/AuthRequest';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import { bodyStringValidator } from '@/validators/BodyBaseValidator';
import { FollowTypes } from '@enums';

export default class FollowAnimeRequest extends AuthRequest {
    public params!: {
        animeId: number;
    };
    public body!: {
        type: FollowTypes;
        groupName: string;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            paramIntValidator('animeId'),
            bodyStringValidator('type').isIn(['announcement', 'follow']).bail(),
            bodyStringValidator('groupName').optional()
        ];
    }
}

export const followAnimeReq = new FollowAnimeRequest().send();
