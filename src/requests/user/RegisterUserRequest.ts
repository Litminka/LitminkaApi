import { RegistrationValidation } from "../../validators/UserValidator";
import Request from "../Request";

export default class RegisterUserRequest extends Request {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return RegistrationValidation();
    }
}