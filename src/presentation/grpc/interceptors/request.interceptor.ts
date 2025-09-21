import { logger } from '@app/infrastructure/logger';
import { langContext } from '@app/shared/utils';
import {
    ServerUnaryCall,
    sendUnaryData,
    status,
    ServiceError,
    Metadata,
} from '@grpc/grpc-js';
import { v4 as uuidv4 } from 'uuid';

export function grpcRequestInterceptor<TRequest, TResponse>(methodName: string) {
    return async (
        call: ServerUnaryCall<TRequest, TResponse>,
        next: (
            call: ServerUnaryCall<TRequest, TResponse>,
            callback: sendUnaryData<TResponse>
        ) => Promise<void>,
        callback: sendUnaryData<TResponse>
    ): Promise<void> => {
        try {
            const metadata = call.metadata.getMap();
            let requestId = call.metadata.get('request-id')[0] as string | undefined;
            if (!requestId) {
                requestId = uuidv4();
                call.metadata.add('request-id', requestId);
            }

            const lang = metadata['accept-language'] as string | undefined === 'id' ? 'id' : 'en';
            langContext.setLang(lang);

            const logData = {
                requestId,
                method: methodName,
                peer: call.getPeer(),
                metadata: call.metadata.getMap(),
                request: call.request,
                timestamp: new Date().toISOString(),
            };
            
            logger.startRequest(logData);
            await next(call, callback);
        } catch (error) {
            console.error('gRPC Request Interceptor Error:', error);

            const grpcError: ServiceError = {
                name: 'InternalError',
                message: 'Failed to process request context',
                code: status.INTERNAL,
                details: 'Internal server error',
                metadata: new Metadata(),
            };

            callback(grpcError, null);
        }
    };
}
