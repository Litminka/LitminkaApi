import { RequestStatuses } from "../../ts/enums";
import BaseError from "../BaseError";

export default class UnprocessableContentError extends BaseError {
    constructor(message = "Unprocessable Content") {
        super(message, {status: RequestStatuses.UnprocessableContent});
    }
}