import { RequestStatuses } from '@enums';
import BaseError from '@/errors/BaseError';

export default class UnprocessableContentError extends BaseError {
    constructor(message = 'Unprocessable Content') {
        super(message, { status: RequestStatuses.UnprocessableContent });
    }
}
