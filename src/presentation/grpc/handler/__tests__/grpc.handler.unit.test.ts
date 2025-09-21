import { Server, ServerUnaryCall, sendUnaryData, handleUnaryCall } from '@grpc/grpc-js';
import { registerGrpcHandlers, wrapUnaryHandler } from '@app/presentation/grpc/handler/grpc.handler';
import * as protoLoader from '@app/presentation/grpc/proto/load.proto';

interface TestRequest {
    input: string;
}
interface TestResponse {
    result: string;
}

jest.mock('@app/modules/register.grpc.handler', () => ({
    grpcHandlerGroups: [
        {
            serviceName: 'TestService',
            moduleName: 'test',
            handlers: {
                testMethod: jest.fn((call: ServerUnaryCall<TestRequest, TestResponse>, callback: sendUnaryData<TestResponse>) => {
                callback(null, { result: 'success' });
                }),
            },
        },
    ],
}));

jest.mock('@app/presentation/grpc/proto/load.proto', () => ({
    loadProto: jest.fn(() => ({
        testMethod: jest.fn(),
    })),
}));

jest.mock('@app/presentation/grpc/interceptors', () => ({
    grpcRequestInterceptor: jest.fn(() => jest.fn((call, next) => next(call))),
    errorInterceptor: jest.fn(async (_, next) => next()),
    composeInterceptors: jest.fn((_interceptors, handler) => handler),
}));

describe('wrapUnaryHandler', () => {
    it('should call callback successfully', async () => {
        const mockHandler: handleUnaryCall<TestRequest, TestResponse> = (
            _call,
            callback
        ) => {
            callback(null, { result: 'ok' });
        };

        const wrapped = wrapUnaryHandler(mockHandler);
        const mockCallback = jest.fn();

        const mockCall = {} as ServerUnaryCall<TestRequest, TestResponse>;

        await wrapped(mockCall, mockCallback);

        expect(mockCallback).toHaveBeenCalledWith(null, { result: 'ok' });
    });

    it('should catch thrown error', async () => {
        const error = new Error('handler failed');

        const mockHandler: handleUnaryCall<TestRequest, TestResponse> = () => {
            throw error;
        };

        const wrapped = wrapUnaryHandler(mockHandler);
        const mockCallback = jest.fn();

        const mockCall = {} as ServerUnaryCall<TestRequest, TestResponse>;

        await expect(wrapped(mockCall, mockCallback)).rejects.toThrow('handler failed');
    });
});

describe('registerGrpcHandlers', () => {
    it('should register all gRPC handlers into the server', () => {
        const mockAddService = jest.fn();
        const mockServer = { addService: mockAddService } as unknown as Server;

        registerGrpcHandlers(mockServer);

        expect(protoLoader.loadProto).toHaveBeenCalledWith('TestService', 'test');
        expect(mockAddService).toHaveBeenCalled();
    });
});
