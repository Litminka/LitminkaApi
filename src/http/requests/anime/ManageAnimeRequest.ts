import { Permissions } from '@enums';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import { ValidationChain } from 'express-validator';
import AuthRequest from '@requests/AuthRequest';

export default class ManageAnimeRequest extends AuthRequest {
    protected permissions = [Permissions.ManageAnime];

    public params!: {
        animeId: number;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [paramIntValidator('animeId')];
    }
}

export const manageAnimeReq = new ManageAnimeRequest().send();
