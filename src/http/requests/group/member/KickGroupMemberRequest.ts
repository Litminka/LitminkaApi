import { ValidationChain } from 'express-validator';
import GroupRequest from '@requests/group/GroupRequest';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import { bodyIntValidator } from '@/validators/BodyBaseValidator';

export default class KickGroupMemberRequest extends GroupRequest {
    public params!: {
        groupId: number;
    };
    public body!: {
        userId: number;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [paramIntValidator('groupId'), bodyIntValidator('userId')];
    }
}

export const kickGroupMemberReq = new KickGroupMemberRequest().send();
