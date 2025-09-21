import { status, Metadata, ServiceError } from '@grpc/grpc-js';
import { GrpcInterceptor } from '@app/presentation/grpc/types/interceptor.type';
import { DomainError } from '@app/shared/errors/internal.error';

export const errorInterceptor: GrpcInterceptor = async (call, method, callback) => {
    try {
        await method(call, callback);
    } catch (error: unknown) {
        const metadata = new Metadata();

        let grpcStatus = status.UNKNOWN;
        let message: string = 'Internal server error';

        if (error instanceof DomainError) {
            grpcStatus = mapHttpToGrpcStatus(error.status ?? 500);
            message = error.message;

            if (error.data?.code) {
                metadata.set('internalCode', String(error.data.code));
            }

            if (error.data?.data) {
                metadata.set('data', JSON.stringify(error.data.data));
            }
        } else if (error instanceof Error) {
            message = error.message;
        }

        if (
            process.env.NODE_ENV !== 'production' &&
            error instanceof Error &&
            typeof error.stack === 'string'
        ) {
            metadata.set('stack', error.stack);
        }

        const grpcError: ServiceError = {
            name: 'ServiceError',
            message,
            code: grpcStatus,
            details: '',
            metadata,
        };

        callback(grpcError, { error: 'error' });
    }
};

function mapHttpToGrpcStatus(httpCode: number): status {
    switch (httpCode) {
        case 400: return status.INVALID_ARGUMENT;
        case 401: return status.UNAUTHENTICATED;
        case 403: return status.PERMISSION_DENIED;
        case 404: return status.NOT_FOUND;
        case 409: return status.ALREADY_EXISTS;
        case 429: return status.RESOURCE_EXHAUSTED;
        case 500: return status.INTERNAL;
        case 503: return status.UNAVAILABLE;
        default: return status.UNKNOWN;
    }
}
