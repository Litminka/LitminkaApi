import { RequestStatuses } from "../../ts/enums";
import BaseError from "../BaseError";

export default class BadRequestError extends BaseError {
    constructor(message = "Bad request") {
        super(message, {status: RequestStatuses.BadRequest});
    }
}