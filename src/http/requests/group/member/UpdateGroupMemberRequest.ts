import { ValidationChain } from 'express-validator';
import GroupRequest from '@requests/group/GroupRequest';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import { bodyBoolValidator, bodyIntValidator } from '@/validators/BodyBaseValidator';

export default class UpdateGroupMemberRequest extends GroupRequest {
    public params!: {
        groupId: number;
    };
    public body!: {
        userId: number;
        modifyList: boolean;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            paramIntValidator('groupId'),
            bodyIntValidator('userId'),
            bodyBoolValidator('modifyList')
        ];
    }
}

export const updateGroupMemberReq = new UpdateGroupMemberRequest().send();
