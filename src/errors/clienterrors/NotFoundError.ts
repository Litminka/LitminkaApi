import { RequestStatuses } from '@enums';
import BaseError from '@/errors/BaseError';

export default class NotFoundError extends BaseError {
    constructor(message = 'Not found') {
        super(message, { status: RequestStatuses.NotFound });
    }
}
