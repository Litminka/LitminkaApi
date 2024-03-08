import { RequestStatuses } from "../../ts/enums";
import BaseError from "../BaseError";

export default class NotFoundError extends BaseError {
    constructor(message = "Not found") {
        super(message, {status: RequestStatuses.NotFound});
    }
}