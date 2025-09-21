import { Request, Response, NextFunction } from 'express';
import { notFoundHandler, globalErrorHandler } from '@app/presentation/http/middlewares/error.middleware';
import { HttpError } from '@app/shared/errors';
import HttpResponse from '@app/presentation/http/responses/http.response';
import { ErrorResponse } from '@app/shared/types';
import { logger } from '@app/infrastructure/logger';

jest.mock('@app/infrastructure/logger', () => ({
    logger: {
        errorException: jest.fn(),
    },
}));

jest.mock('@app/presentation/http/responses/http.response', () => ({
    __esModule: true,
    default: {
        errorHandler: jest.fn(),
    },
}));

describe('notFoundHandler', () => {
    it('should call next with not found error', () => {
        const req = {} as Request;
        const res = {} as Response;
        const next: NextFunction = jest.fn();

        notFoundHandler(req, res, next);

        expect(next).toHaveBeenCalled();

        const error = (next as jest.Mock).mock.calls[0][0];
        expect(error.status).toBe(404);
    });
});

describe('globalErrorHandler', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { requestId: 'test-request-id' },
    } as unknown as Response;

    const req = {} as Request;
    const next: NextFunction = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle known ErrorResponse with array errors', () => {
        const error: ErrorResponse = HttpError.badRequest([
            { code: 1001, message: 'Validation failed', status: 400 },
        ]);

        globalErrorHandler(error, req, res, next);

        expect(HttpResponse.errorHandler).toHaveBeenCalledWith(res, 400, {
            meta: { 'request-id': 'test-request-id' },
            errors: error.errors,
        });
    });

    it('should handle ErrorResponse with single error object', () => {
        const error: ErrorResponse = HttpError.unAuthorize({
            code: 4010,
            message: 'Token expired',
            status: 401,
        });

        globalErrorHandler(error, req, res, next);

        expect(HttpResponse.errorHandler).toHaveBeenCalledWith(res, 401, {
            meta: { 'request-id': 'test-request-id' },
            errors: [error.errors],
        });
    });

    it('should call logger.errorException', () => {
        const error: ErrorResponse = HttpError.notFound([
            { code: 4040, message: 'User not found', status: 404 },
        ]);

        globalErrorHandler(error, req, res, next);

        expect(logger.errorException).toHaveBeenCalledWith(res, {
            status: 404,
            appErrors: error.errors,
            originalError: undefined,
        });
    });
});
