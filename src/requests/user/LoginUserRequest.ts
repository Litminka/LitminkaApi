import { LoginValidation } from "../../validators/UserValidator";
import Request from "../Request";

export default class LoginUserRequest extends Request {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return LoginValidation();
    }
}