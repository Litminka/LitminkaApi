import { RequestStatuses } from '@enums';
import BaseError from '@/errors/BaseError';

export default class UnauthorizedError extends BaseError {
    constructor(message = 'Unauthorized') {
        super(message, { status: RequestStatuses.Unauthorized });
    }
}
