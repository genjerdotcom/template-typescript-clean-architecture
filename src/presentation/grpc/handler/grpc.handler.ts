import { Server, ServerUnaryCall, sendUnaryData, handleUnaryCall } from '@grpc/grpc-js';
import { grpcHandlerGroups } from '@app/modules/register.grpc.handler';
import { loadProto } from '@app/presentation/grpc/proto/load.proto';
import { grpcRequestInterceptor, composeInterceptors } from '@app/presentation/grpc/interceptors';
import { errorInterceptor } from '@app/presentation/grpc/interceptors/error.interceptor';
import { GrpcHandlerFn } from '@app/presentation/grpc/types/interceptor.type';

export function wrapUnaryHandler<TRequest, TResponse>(
    handler: handleUnaryCall<TRequest, TResponse>
): GrpcHandlerFn<TRequest, TResponse> {
    return async (
        call: ServerUnaryCall<TRequest, TResponse>,
        callback: sendUnaryData<TResponse>
    ): Promise<void> => {
        await new Promise<void>((resolve, reject) => {
            try {
                handler(call, callback);
                resolve();
            } catch (error) {
                reject(error instanceof Error ? error : new Error(String(error)));
            }
        });
    };
}

export function registerGrpcHandlers(server: Server) {
    for (const handlerGroup of grpcHandlerGroups) {
        const { serviceName, moduleName, handlers } = handlerGroup;
        const serviceDefinition = loadProto(serviceName, moduleName);

        const wrappedHandlers = {} as typeof handlers;
        for (const methodName of Object.keys(handlers)) {
            const originalHandler = handlers[methodName] as handleUnaryCall<unknown, unknown>;
            const composed = composeInterceptors(
                [grpcRequestInterceptor(String(methodName)), errorInterceptor],
                wrapUnaryHandler(originalHandler)
            );
            wrappedHandlers[methodName] = composed;
        }

        server.addService(serviceDefinition, wrappedHandlers);
    }
}
