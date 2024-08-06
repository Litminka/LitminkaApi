import prisma from '@/db';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import { baseMsg } from '@/ts/messages';
import { ValidationChain } from 'express-validator';
import IntegrationSettingsRequest from '@requests/IntegrationSettingsRequest';

export default class DeleteFromWatchListRequest extends IntegrationSettingsRequest {
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
