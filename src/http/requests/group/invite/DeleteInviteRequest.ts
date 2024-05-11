import { ValidationChain } from 'express-validator';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import { bodyIntValidator } from '@/validators/BodyBaseValidator';
import GroupRequest from '@requests/group/GroupRequest';

export default class DeleteInviteRequest extends GroupRequest {
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

export const deleteInviteReq = new DeleteInviteRequest().send();
