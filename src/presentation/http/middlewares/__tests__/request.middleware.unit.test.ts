import RequestMiddleware from '@app/presentation/http/middlewares/request.middleware';
import { Request, Response, NextFunction } from 'express';
import { logger } from '@app/infrastructure/logger';
import { langContext } from '@app/shared/utils/langcontext.util';

jest.mock('@app/infrastructure/logger', () => ({
    logger: {
        startRequest: jest.fn(),
    },
}));

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mocked-request-id'),
}));

jest.mock('@app/shared/utils/langcontext.util', () => ({
    langContext: {
        setLang: jest.fn(),
    },
}));

describe('RequestMiddleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: {},
            method: 'GET',
            originalUrl: '/test',
            query: {},
            body: {},
        };
            res = {
            locals: {},
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should assign request-id and locale, then call next()', () => {
        req.headers = {
            'accept-language': 'id,en;q=0.8',
        };

        RequestMiddleware(req as Request, res as Response, next);

        expect(req.headers['request-id']).toBe('mocked-request-id');
        expect(res.locals?.requestId).toBe('mocked-request-id');
        expect(res.locals?.locale).toBe('id');
        expect(langContext.setLang).toHaveBeenCalledWith('id');
        expect(logger.startRequest).toHaveBeenCalledWith(
        expect.objectContaining({
            requestId: 'mocked-request-id',
            lang: 'id',
            headers: req.headers,
            method: 'GET',
            originalUrl: '/test',
            query: '{}',
            body: {},
        })
        );
        expect(next).toHaveBeenCalled();
    });

    it('should default to "en" locale if invalid language header provided', () => {
        req.headers = {
            'accept-language': 'fr',
        };

        RequestMiddleware(req as Request, res as Response, next);

        expect(res.locals?.locale).toBe('en');
        expect(langContext.setLang).toHaveBeenCalledWith('fr');
        expect(next).toHaveBeenCalled();
    });

    it('should use provided request-id if present', () => {
        req.headers = {
            'request-id': 'custom-id',
            'accept-language': 'en',
        };

        RequestMiddleware(req as Request, res as Response, next);

        expect(req.headers['request-id']).toBe('custom-id');
        expect(res.locals?.requestId).toBe('custom-id');
        expect(langContext.setLang).toHaveBeenCalledWith('en');
        expect(next).toHaveBeenCalled();
    });
});
