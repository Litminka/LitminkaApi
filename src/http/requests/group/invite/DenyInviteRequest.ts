import { ValidationChain } from 'express-validator';
import { GroupInviteReq, GroupInviteRequest } from '@requests/group/GroupInviteRequest';
import { paramIntValidator } from '@validators/ParamBaseValidator';

export interface DenyInviteReq extends GroupInviteReq {
    params: {
        inviteId: number;
    };
}

export class DenyInviteRequest extends GroupInviteRequest {
    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [paramIntValidator('inviteId')];
    }
}
