export default class BaseError extends Error {
    status: number;

    constructor(message: string, { status }: { status: number }) {
        super(message);
        this.status = status;
    }
}