import { paramIntValidator } from '@/validators/ParamBaseValidator';
import { ValidationChain } from 'express-validator';
import ProfileUserRequest from '@requests/ProfileUserRequest';

export default class DeleteFromWatchListRequest extends ProfileUserRequest {
    public params!: {
        animeId: number;
    };
    /**
     * Define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): ValidationChain[] {
        return [paramIntValidator('animeId')];
    }
}

export const deleteFromWatchListReq = new DeleteFromWatchListRequest().send();
