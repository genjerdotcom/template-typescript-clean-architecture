import {
    ServerUnaryCall,
    sendUnaryData,
} from '@grpc/grpc-js';


export type GrpcHandlerFn<TRequest = unknown, TResponse = unknown> = (
    call: ServerUnaryCall<TRequest, TResponse>,
    callback: sendUnaryData<TResponse>
) => Promise<void>;

export type GrpcInterceptor<TRequest = unknown, TResponse = unknown> = (
    call: ServerUnaryCall<TRequest, TResponse>,
    next: GrpcHandlerFn<TRequest, TResponse>,
    callback: sendUnaryData<TResponse>
) => Promise<void>;
