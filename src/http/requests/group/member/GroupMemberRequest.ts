import { ValidationChain } from 'express-validator';
import AuthRequest from '@requests/AuthRequest';
import { paramIntValidator } from '@/validators/ParamBaseValidator';

export default class GroupMemberRequest extends AuthRequest {
    public params!: {
        groupId: number;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [paramIntValidator('groupId')];
    }
}

export const groupMemberReq = new GroupMemberRequest().send();
