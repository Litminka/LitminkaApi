import { RequestStatuses } from "../../ts/enums";
import BaseError from "../BaseError";

export default class UnauthorizedError extends BaseError {
    constructor(message = "Unauthorized") {
        super(message, {status: RequestStatuses.Unauthorized});
    }
}