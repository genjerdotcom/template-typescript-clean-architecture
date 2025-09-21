import {
    status,
    handleUnaryCall,
} from '@grpc/grpc-js';
import { GrpcInterceptor, GrpcHandlerFn } from '@app/presentation/grpc/types/interceptor.type';

export function composeInterceptors<TRequest, TResponse>(
    interceptors: GrpcInterceptor<TRequest, TResponse>[],
    handler: GrpcHandlerFn<TRequest, TResponse>
): handleUnaryCall<TRequest, TResponse> {
    return (call, callback) => {
        const chain = interceptors.reduceRight<GrpcHandlerFn<TRequest, TResponse>>(
            (next, interceptor) => {
                return async (innerCall, innerCallback) => {
                    try {
                        await interceptor(innerCall, next, innerCallback);
                    } catch (err) {
                        console.error('[gRPC Interceptor Error]', err);
                        innerCallback({
                        code: status.INTERNAL,
                        message: err instanceof Error ? err.message : 'Unknown error',
                        }, null);
                    }
                };
            },
            handler
        );

        void chain(call, callback);
    };
}
