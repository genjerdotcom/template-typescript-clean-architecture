import { status, ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import { composeInterceptors } from '@app/presentation/grpc/interceptors/compose.interceptor';
import { GrpcInterceptor, GrpcHandlerFn } from '@app/presentation/grpc/types/interceptor.type';

interface TestRequest {
    message: string;
}

interface TestResponse {
    response: string;
}

describe('composeInterceptors', () => {
    const mockCall = {} as ServerUnaryCall<TestRequest, TestResponse>;
    const mockCallback: sendUnaryData<TestResponse> = jest.fn();

    it('should call handler if no interceptors are present', async () => {
        const handler: GrpcHandlerFn<TestRequest, TestResponse> = jest.fn(async (_call, cb) => {
            cb(null, { response: 'ok' });
        });

        const composed = composeInterceptors([], handler);
        composed(mockCall, mockCallback);

        expect(handler).toHaveBeenCalledWith(mockCall, mockCallback);
    });

    it('should call interceptors in the correct order', async () => {
        const order: string[] = [];

        const interceptor1: GrpcInterceptor<TestRequest, TestResponse> = async (call, next, callback) => {
            order.push('interceptor1');
            await next(call, callback);
        };

        const interceptor2: GrpcInterceptor<TestRequest, TestResponse> = async (call, next, callback) => {
            order.push('interceptor2');
            await next(call, callback);
        };

        const handler: GrpcHandlerFn<TestRequest, TestResponse> = async (_call, callback) => {
            order.push('handler');
            callback(null, { response: 'done' });
        };

        const composed = composeInterceptors([interceptor1, interceptor2], handler);
        composed(mockCall, mockCallback);

        // Ensure execution order is: interceptor1 -> interceptor2 -> handler
        expect(order).toEqual(['interceptor1', 'interceptor2', 'handler']);
    });

    it('should handle errors thrown in interceptor and respond with INTERNAL status', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const errorInterceptor: GrpcInterceptor<TestRequest, TestResponse> = async (_call, _next, _callback) => {
            throw new Error('Interceptor failure');
        };

        const handler: GrpcHandlerFn<TestRequest, TestResponse> = jest.fn();

        const callbackSpy: sendUnaryData<TestResponse> = jest.fn();

        const composed = composeInterceptors([errorInterceptor], handler);
        composed(mockCall, callbackSpy);

        // Wait for async error handler
        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(handler).not.toHaveBeenCalled();
        expect(callbackSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                code: status.INTERNAL,
                message: 'Interceptor failure',
            }),
            null
        );
    });
});
