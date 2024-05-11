import Request from '@/http/requests/Request';
import { ValidationChain } from 'express-validator';
import { bodyStringValidator } from '@/validators/BodyBaseValidator';

export default class LoginUserRequest extends Request {
    public body!: {
        login: string;
        password: string;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [bodyStringValidator('login'), bodyStringValidator('password')];
    }
}

export const loginUserReq = new LoginUserRequest().send();
