import { ServerUnaryCall, sendUnaryData, status, Metadata } from '@grpc/grpc-js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GrpcInterceptor } from '@app/presentation/grpc/types/interceptor.type';

export function grpcValidateRequest<TRequest extends object, TResponse>(
    DtoClass: new () => TRequest
): GrpcInterceptor<TRequest, TResponse> {
    return async (
        call: ServerUnaryCall<TRequest, TResponse>,
        next: (call: ServerUnaryCall<TRequest, TResponse>, callback: sendUnaryData<TResponse>) => Promise<void>,
        callback: sendUnaryData<TResponse>
    ): Promise<void> => {
        const instance = plainToInstance(DtoClass, call.request);
        const errors = await validate(instance);

        if (errors.length > 0) {
            const metadata = new Metadata();
            const messages = errors
                .map((e) => {
                    const constraints = Object.values(e.constraints ?? {}).join(', ');
                    return `${e.property}: ${constraints}`;
                }).join('; ');

            const grpcError = {
                name: 'BadRequest',
                message: messages,
                code: status.INVALID_ARGUMENT,
                details: messages,
                metadata,
            };

            callback(grpcError, null);
            return;
        }

        await next(call, callback);
    };
}
