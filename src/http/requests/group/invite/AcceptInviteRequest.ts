import { ValidationChain } from 'express-validator';
import { bodyBoolValidator } from '@/validators/BodyBaseValidator';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import GroupInviteRequest from '@requests/group/GroupInviteRequest';

export default class AcceptInviteRequest extends GroupInviteRequest {
    public params!: {
        inviteId: number;
    };
    public body!: {
        modifyList: boolean;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [paramIntValidator('inviteId'), bodyBoolValidator('modifyList', { defValue: true })];
    }
}

export const acceptInviteReq = new AcceptInviteRequest().send();
