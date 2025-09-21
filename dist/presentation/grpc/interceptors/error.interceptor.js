"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorInterceptor = void 0;
// presentation/grpc/interceptors/error.interceptor.ts
const grpc_js_1 = require("@grpc/grpc-js");
const internal_error_1 = require("../../../shared/errors/internal.error");
const errorInterceptor = async (call, method, callback) => {
    try {
        await method(call, callback);
    }
    catch (error) {
        const metadata = new grpc_js_1.Metadata();
        let grpcStatus = grpc_js_1.status.UNKNOWN;
        let message = 'Internal server error';
        if (error instanceof internal_error_1.DomainError) {
            grpcStatus = mapHttpToGrpcStatus(error.status ?? 500);
            message = error.message;
            // Tambahkan detail error ke metadata
            if (error.data?.code) {
                metadata.set('internalCode', String(error.data.code));
            }
            if (error.data?.data) {
                metadata.set('data', JSON.stringify(error.data.data));
            }
        }
        else if (error instanceof Error) {
            message = error.message;
        }
        // Optional: kirim stack trace saat development
        if (process.env.NODE_ENV !== 'production' && error instanceof Error && error.stack) {
            metadata.set('stack', error.stack);
        }
        callback({
            code: grpcStatus,
            message,
            metadata,
        }, {
            error: 'error',
        });
    }
};
exports.errorInterceptor = errorInterceptor;
function mapHttpToGrpcStatus(httpCode) {
    switch (httpCode) {
        case 400: return grpc_js_1.status.INVALID_ARGUMENT;
        case 401: return grpc_js_1.status.UNAUTHENTICATED;
        case 403: return grpc_js_1.status.PERMISSION_DENIED;
        case 404: return grpc_js_1.status.NOT_FOUND;
        case 409: return grpc_js_1.status.ALREADY_EXISTS;
        case 429: return grpc_js_1.status.RESOURCE_EXHAUSTED;
        case 500: return grpc_js_1.status.INTERNAL;
        case 503: return grpc_js_1.status.UNAVAILABLE;
        default: return grpc_js_1.status.UNKNOWN;
    }
}
