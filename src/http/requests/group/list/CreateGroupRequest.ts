import { ValidationChain } from 'express-validator';
import GroupRequest from '@requests/group/GroupRequest';
import { bodyStringValidator } from '@/validators/BodyBaseValidator';

export default class CreateGroupRequest extends GroupRequest {
    public body!: {
        name: string;
        description: string;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyStringValidator('name').optional(),
            bodyStringValidator('description').optional()
        ];
    }
}

export const createGroupReq = new CreateGroupRequest().send();
