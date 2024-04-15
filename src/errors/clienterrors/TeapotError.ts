import { RequestStatuses } from '@enums';
import BaseError from '@/errors/BaseError';

export default class TeapotError extends BaseError {
    constructor(message = 'Oopsie-woopsie i made a fucky-wucky') {
        super(message, { status: RequestStatuses.ImATeapot });
    }
}
