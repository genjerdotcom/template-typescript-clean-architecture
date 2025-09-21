import { errorInterceptor } from '@app/presentation/grpc/interceptors/error.interceptor';
import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';

type TestRequest = { name: string };
type TestResponse = { message: string };

const mockCall = {} as ServerUnaryCall<TestRequest, TestResponse>;
const createMockCallback = (): jest.MockedFunction<sendUnaryData<unknown>> => jest.fn();

describe('errorInterceptor', () => {
    it('should call method without error', async () => {
        const mockCallback = createMockCallback();
        const mockMethod = jest.fn().mockImplementation((_call, cb) => {
            cb(null, { message: 'OK' });
        });

        await errorInterceptor(mockCall, mockMethod, mockCallback);

        expect(mockMethod).toHaveBeenCalledWith(mockCall, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, { message: 'OK' });
    });
});
