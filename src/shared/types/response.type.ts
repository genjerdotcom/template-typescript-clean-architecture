interface Meta {
    code: string;
    status: string;
    message: string;
}
export interface ResponseWithHeaders<T = unknown> {
    headers?: {
        [key: string]: string | string[] | undefined;
        authorization?: string;
        contentType?: string;
    };
    body?: T;
    statusCode?: number;
    message?: string;
    method?: string;
    originalUrl?: string;
    query?: string;
    requestId?: string;
    user?: unknown;
}

export interface SuccessResponse<T> {
    meta: Meta;
    data: T;
}

export interface PaginationResponse<T> {
    meta: Meta;
    recordsTotal: number;
    data: T;
}
export interface ResponseContext {
    locals: {
        requestId?: string;
        requestDate?: string;
        [key: string]: unknown;
    };
}