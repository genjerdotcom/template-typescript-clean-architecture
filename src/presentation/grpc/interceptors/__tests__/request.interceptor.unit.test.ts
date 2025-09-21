import { grpcRequestInterceptor } from '@app/presentation/grpc/interceptors/request.interceptor';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@app/infrastructure/logger';
import { langContext } from '@app/shared/utils/langcontext.util';

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('mock-request-id'),
}));

jest.mock('@app/infrastructure/logger', () => ({
    logger: {
        startRequest: jest.fn(),
    },
}));

jest.mock('@app/shared/utils/langcontext.util', () => ({
    langContext: {
        setLang: jest.fn(),
    },
}));

type TestRequest = { foo: string };
type TestResponse = { bar: string };

const createMockCall = (metadataMap: Record<string, string>): ServerUnaryCall<TestRequest, TestResponse> => {
    const metadata = {
        getMap: () => metadataMap,
        get: (key: string) => (metadataMap[key] ? [metadataMap[key]] : []),
        add: jest.fn(),
    };

    return {
        metadata: metadata,
        request: { foo: 'value' },
        getPeer: () => 'peer-address',
    } as unknown as ServerUnaryCall<TestRequest, TestResponse>;
};

const createMockCallback = (): jest.MockedFunction<sendUnaryData<TestResponse>> => {
    return jest.fn();
};

describe('grpcRequestInterceptor', () => {
    const methodName = 'TestService/TestMethod';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set requestId, language, and call logger then call next()', async () => {
        const call = createMockCall({ 'accept-language': 'id' });
        const callback = createMockCallback();

        const next = jest.fn().mockResolvedValue(undefined);

        await grpcRequestInterceptor<TestRequest, TestResponse>(methodName)(call, next, callback);

        expect(uuidv4).toHaveBeenCalled();
        expect(call.metadata.add).toHaveBeenCalledWith('request-id', 'mock-request-id');
        expect(langContext.setLang).toHaveBeenCalledWith('id');
        expect(logger.startRequest).toHaveBeenCalledWith(
        expect.objectContaining({
            requestId: 'mock-request-id',
            method: methodName,
            peer: 'peer-address',
            request: { foo: 'value' },
            metadata: expect.any(Object),
        })
        );
        expect(next).toHaveBeenCalledWith(call, callback);
    });

    it('should handle existing request-id and default language to en', async () => {
        const call = createMockCall({
            'accept-language': 'fr',
            'request-id': 'existing-id',
        });
        const callback = createMockCallback();
        const next = jest.fn().mockResolvedValue(undefined);

        await grpcRequestInterceptor<TestRequest, TestResponse>(methodName)(call, next, callback);

        expect(call.metadata.add).not.toHaveBeenCalled();
        expect(langContext.setLang).toHaveBeenCalledWith('en');
        expect(logger.startRequest).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it('should call callback with INTERNAL error on exception', async () => {
        const call = createMockCall({ 'accept-language': 'id' });
        const callback = createMockCallback();
        const next = jest.fn().mockRejectedValue(new Error('Unexpected failure'));

        await grpcRequestInterceptor<TestRequest, TestResponse>(methodName)(call, next, callback);

        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({
                code: status.INTERNAL,
                message: 'Failed to process request context',
                name: 'InternalError',
            }),
            null
        );
    });
});
