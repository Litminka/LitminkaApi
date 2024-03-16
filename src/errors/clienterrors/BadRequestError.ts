import { RequestStatuses } from "@/ts/enums";
import BaseError from "@errors/BaseError";

export default class BadRequestError extends BaseError {
    constructor(message = "Bad request") {
        super(message, { status: RequestStatuses.BadRequest });
    }
}