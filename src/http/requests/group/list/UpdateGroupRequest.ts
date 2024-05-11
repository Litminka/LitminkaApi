import { ValidationChain } from 'express-validator';
import GroupRequest from '@requests/group/GroupRequest';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import { bodyStringValidator } from '@/validators/BodyBaseValidator';

export default class UpdateGroupRequest extends GroupRequest {
    public params!: {
        groupId: number;
    };
    public body!: {
        name?: string;
        description?: string;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            paramIntValidator('groupId'),
            bodyStringValidator('name').optional(),
            bodyStringValidator('description').optional()
        ];
    }
}

export const updateGroupReq = new UpdateGroupRequest().send();
