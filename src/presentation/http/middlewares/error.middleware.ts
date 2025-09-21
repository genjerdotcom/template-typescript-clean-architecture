import { Request, Response, NextFunction } from 'express';
import HttpResponse from '@app/presentation/http/responses/http.response';
import { HttpError, InternalError } from '@app/shared/errors';
import { logger } from '@app/infrastructure/logger';
import { ErrorResponse, isAppError } from '@app/shared/types';

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
    next(
        HttpError.notFound(
            new InternalError.ResourceNotFoundError('URL')
        )
    );
}

export function globalErrorHandler(err: ErrorResponse, _req: Request, res: Response, next: NextFunction): void {
    const rawErrors = err.errors ?? err;
    let appErrors: unknown[] = [];

    if (Array.isArray(rawErrors)) {
        appErrors = rawErrors.map((e): unknown => {
            if (isAppError(e)) return e;
            return e;
        });
    } else if (isAppError(rawErrors)) {
        appErrors = [rawErrors.data];
    } else {
        appErrors = [rawErrors];
    }

    let { originalError } = err;

    if (appErrors[0] instanceof Error) {
        [originalError] = appErrors as [Error];
        appErrors = [new InternalError.UnknownError().data];
    }

    const status = err.status ?? err.http_status ?? 500;

    logger.errorException(res, {
        status,
        appErrors,
        originalError,
    });

    HttpResponse.errorHandler(res, status, {
        meta: { 'request-id': res.locals.requestId },
        errors: appErrors
    });

    next()
}
