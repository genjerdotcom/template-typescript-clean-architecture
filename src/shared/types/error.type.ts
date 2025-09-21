export type AppError = { data: object } | object;
export interface ErrorData {
    errors: {
        message: string;
        stack?: string;
    };
}

export interface ErrorResponse {
    errors: AppError[] | AppError;
    code?: string;
    status?: number;
    http_status?: number;
    originalError?: Error;
}

export function isAppError(error: AppError) {
    return typeof error === 'object' && error !== null && 'data' in error;
}