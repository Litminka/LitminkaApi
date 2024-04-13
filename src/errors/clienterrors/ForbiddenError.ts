import { RequestStatuses } from '@enums';
import BaseError from '@/errors/BaseError';

export default class ForbiddenError extends BaseError {
    constructor(message = 'Forbidden') {
        super(message, { status: RequestStatuses.Forbidden });
    }
}
