import { RequestStatuses } from "../ts/enums";
import BaseError from "./BaseError";

export default class ForbiddenError extends BaseError {
    constructor(message = "Forbidden") {
        super(message, {status: RequestStatuses.Forbidden});
    }
}