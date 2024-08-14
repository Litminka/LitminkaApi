import { paramStringValidator } from '@/validators/ParamBaseValidator';
import { ValidationChain } from 'express-validator';
import OptionalRequest from '@requests/OptionalRequest';

export default class GetSingleAnimeRequest extends OptionalRequest {
    public params!: {
        slug: string;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [paramStringValidator('slug', { typeParams: { max: 256 } })];
    }
}

export const getSingleAnimeReq = new GetSingleAnimeRequest().send();
