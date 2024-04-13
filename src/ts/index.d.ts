import { Request } from 'express';

export interface RequestWithBot extends Request {
    auth?: {
        user: undefined;
        id: number;
        bot?: boolean;
        token: string;
    };
}

export interface PaginationQuery {
    page: number;
    pageLimit: number;
}

export interface minmax {
    min: number;
    max?: number;
}
