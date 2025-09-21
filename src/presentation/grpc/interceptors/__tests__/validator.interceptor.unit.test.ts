import { grpcValidateRequest } from '@app/presentation/grpc/interceptors/validator.interceptor';
import { ServerUnaryCall, sendUnaryData, status, ServiceError } from '@grpc/grpc-js';
import { validate } from 'class-validator';

jest.mock('class-validator', () => ({
    validate: jest.fn(),
}));

class TestDto {
    foo!: string;
}

type TestRequest = { foo: string };
type TestResponse = { bar: string };

const createMockCall = (request: TestRequest): ServerUnaryCall<TestRequest, TestResponse> => {
    return {
        request,
    } as ServerUnaryCall<TestRequest, TestResponse>;
};

const createMockCallback = (): jest.MockedFunction<sendUnaryData<unknown>> => jest.fn();

describe('grpcValidateRequest', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call next if validation passes', async () => {
        (validate as jest.Mock).mockResolvedValue([]);

        const call = createMockCall({ foo: 'valid' });
        const callback = createMockCallback();
        const next = jest.fn().mockResolvedValue(undefined);

        const interceptor = grpcValidateRequest(TestDto);
        await interceptor(call, next, callback);

        expect(validate).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(call, callback);
        expect(callback).not.toHaveBeenCalledWith(expect.anything(), null);
    });

    it('should call callback with INVALID_ARGUMENT if validation fails', async () => {
        (validate as jest.Mock).mockResolvedValue([
            {
                property: 'foo',
                constraints: {
                    isNotEmpty: 'foo should not be empty',
                    isString: 'foo must be a string',
                },
            },
        ]);

        const call = createMockCall({ foo: '' });
        const callback = createMockCallback();
        const next = jest.fn();

        const interceptor = grpcValidateRequest(TestDto);
        await interceptor(call, next, callback);

        expect(validate).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();

        const grpcErrorArg = callback.mock.calls[0][0] as ServiceError;

        expect(grpcErrorArg.code).toBe(status.INVALID_ARGUMENT);
        expect(grpcErrorArg.message).toContain('foo: foo should not be empty, foo must be a string');
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({
            code: status.INVALID_ARGUMENT,
            name: 'BadRequest',
        }), null);
    });
});
