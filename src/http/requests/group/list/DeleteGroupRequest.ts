import { ValidationChain } from 'express-validator';
import AuthRequest from '@/http/requests/AuthRequest';
import { paramIntValidator } from '@/validators/ParamBaseValidator';

export default class DeleteGroupRequest extends AuthRequest {
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

export const deleteGroupReq = new DeleteGroupRequest().send();
