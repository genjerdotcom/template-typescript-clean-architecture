import {
    success,
    created,
    error,
    badRequest,
    notFound,
    internalServerError,
    unauthorized,
    forbidden,
} from '@app/presentation/grpc/responses/grpc.response';
import { status, ServiceError, sendUnaryData } from '@grpc/grpc-js';
import { INTERNAL_CODE } from '@app/shared/constants/code';

type TestResponse = Record<string, unknown>;

describe('gRPC Response Helpers', () => {
    const createMockCallback = (): jest.MockedFunction<sendUnaryData<TestResponse>> => 
        jest.fn<ReturnType<sendUnaryData<TestResponse>>, Parameters<sendUnaryData<TestResponse>>>();

    it('should call callback with success response', () => {
        const callback = createMockCallback();
        const data = { foo: 'bar' };
        success(callback, 'Success message', data);

        expect(callback).toHaveBeenCalledWith(null, {
            meta: {
                code: INTERNAL_CODE.SUCCESS.OK.code,
                message: "Success message",
                status: INTERNAL_CODE.SUCCESS.OK.status,
            },
            data,
        });
    });

    it('should call callback with created response', () => {
        const callback = createMockCallback();
        const data = { id: 1 };
        created(callback, 'Created message', data);

        expect(callback).toHaveBeenCalledWith(null, {
            meta: {
                code: INTERNAL_CODE.SUCCESS.CREATED.code,
                message: "Created message",
                status: INTERNAL_CODE.SUCCESS.CREATED.status,
            },
            data
        });
    });

    it('should call callback with error response', () => {
        const callback = createMockCallback();
        const detail = { error: 'detail' };
        error(callback, status.INTERNAL, 'Something went wrong', detail);

        const callArg = callback.mock.calls[0][0] as ServiceError;
        expect(callArg.code).toBe(status.INTERNAL);
        expect(callArg.message).toBe('Something went wrong');
        expect(callArg.details).toBe(JSON.stringify(detail));
        expect(callArg.metadata.get('error-message')[0]).toBe('Something went wrong');
    });

    it('should call callback with badRequest error', () => {
        const callback = createMockCallback();
        badRequest(callback, { reason: 'Invalid data' });

        const callArg = callback.mock.calls[0][0] as ServiceError;
        expect(callArg.code).toBe(status.INVALID_ARGUMENT);
        expect(callArg.message).toBe('Bad Request');
    });

    it('should call callback with notFound error', () => {
        const callback = createMockCallback();
        notFound(callback, { reason: 'Missing' });

        const callArg = callback.mock.calls[0][0] as ServiceError;
        expect(callArg.code).toBe(status.NOT_FOUND);
        expect(callArg.message).toBe('Not Found');
    });

    it('should call callback with internalServerError', () => {
        const callback = createMockCallback();
        internalServerError(callback, { reason: 'Crash' });

        const callArg = callback.mock.calls[0][0] as ServiceError;
        expect(callArg.code).toBe(status.INTERNAL);
        expect(callArg.message).toBe('Internal Server Error');
    });

    it('should call callback with unauthorized error', () => {
        const callback = createMockCallback();
        unauthorized(callback, { reason: 'Token missing' });

        const callArg = callback.mock.calls[0][0] as ServiceError;
        expect(callArg.code).toBe(status.UNAUTHENTICATED);
        expect(callArg.message).toBe('Unauthorized');
    });

    it('should call callback with forbidden error', () => {
        const callback = createMockCallback();
        forbidden(callback, { reason: 'No access' });

        const callArg = callback.mock.calls[0][0] as ServiceError;
        expect(callArg.code).toBe(status.PERMISSION_DENIED);
        expect(callArg.message).toBe('Forbidden');
    });
});
