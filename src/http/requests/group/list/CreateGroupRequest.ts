import { ValidationChain } from 'express-validator';
import { GroupReq, GroupRequest } from '@requests/group/GroupRequest';
import { bodyStringValidator } from '@validators/BodyBaseValidator';

export interface CreateGroupReq extends GroupReq {
    body: {
        name: string;
        description: string;
    };
}

export class CreateGroupRequest extends GroupRequest {
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
