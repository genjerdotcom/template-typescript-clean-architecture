import HttpError, { AppError } from '@app/shared/errors/http.error';
import { HTTP_CODE } from '@app/shared/constants/code';

describe('AppError', () => {
    it('should create an AppError instance with correct values', () => {
        const error = new AppError('Test Error', { detail: 'Something went wrong' }, 400);

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Test Error');
        expect(error.errors).toEqual({ detail: 'Something went wrong' });
        expect(error.status).toBe(400);
        expect(error.name).toBe('AppError');
        expect(error.stack).toBeDefined();
    });
});

describe('HttpError static methods', () => {
    const dummyError = { reason: 'Invalid data' };

    it('should return AppError from notFound()', () => {
        const error = HttpError.notFound(dummyError);
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Not Found');
        expect(error.status).toBe(HTTP_CODE.CLIENT_ERROR.NOT_FOUND.code);
        expect(error.errors).toBe(dummyError);
    });

    it('should return AppError from badRequest()', () => {
        const error = HttpError.badRequest(dummyError);
        expect(error.message).toBe('Bad Request');
        expect(error.status).toBe(HTTP_CODE.CLIENT_ERROR.BAD_REQUEST.code);
    });

    it('should return AppError from unAuthorize()', () => {
        const error = HttpError.unAuthorize(dummyError);
        expect(error.message).toBe('Unauthorized');
        expect(error.status).toBe(HTTP_CODE.CLIENT_ERROR.UNAUTHORIZED.code);
    });

    it('should return AppError from forbidden()', () => {
        const error = HttpError.forbidden(dummyError);
        expect(error.message).toBe('Forbidden');
        expect(error.status).toBe(HTTP_CODE.CLIENT_ERROR.FORBIDDEN.code);
    });

    it('should return AppError from internalServerError()', () => {
        const error = HttpError.internalServerError(dummyError);
        expect(error.message).toBe('Internal Server Error');
        expect(error.status).toBe(HTTP_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR.code);
    });

    it('should return AppError from serviceRequestError() with custom status', () => {
        const error = HttpError.serviceRequestError(dummyError, 418);
        expect(error.message).toBe('Service Request Error');
        expect(error.status).toBe(418);
    });

    it('should return AppError from serviceRequestError() with default status', () => {
        const error = HttpError.serviceRequestError(dummyError);
        expect(error.status).toBe(400);
    });
});
