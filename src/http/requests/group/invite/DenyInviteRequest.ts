import { ValidationChain } from 'express-validator';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import GroupInviteRequest from '@requests/group/GroupInviteRequest';

export default class DenyInviteRequest extends GroupInviteRequest {
    public params!: {
        inviteId: number;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [paramIntValidator('inviteId')];
    }
}

export const denyInviteReq = new DenyInviteRequest().send();
