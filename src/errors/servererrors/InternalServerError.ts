import { RequestStatuses } from "../../ts/enums";
import BaseError from "../BaseError";

export default class InternalServerError extends BaseError {
    constructor(message = "Internal server error") {
        super(message, {status: RequestStatuses.InternalServerError});
    }
}