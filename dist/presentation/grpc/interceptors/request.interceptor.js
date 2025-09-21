"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcRequestInterceptor = grpcRequestInterceptor;
const logger_1 = require("../../../infrastructure/logger");
const utils_1 = require("../../../shared/utils");
const grpc_js_1 = require("@grpc/grpc-js");
const uuid_1 = require("uuid");
function grpcRequestInterceptor(methodName) {
    return async (call, next, callback) => {
        try {
            const metadata = call.metadata.getMap();
            let requestId = call.metadata.get('request-id')[0];
            if (!requestId) {
                requestId = (0, uuid_1.v4)();
                call.metadata.add('request-id', requestId);
            }
            const lang = metadata['accept-language'] === 'id' ? 'id' : 'en';
            utils_1.langContext.setLang(lang);
            const logData = {
                requestId,
                method: methodName,
                peer: call.getPeer(),
                metadata: call.metadata.getMap(),
                request: call.request,
                timestamp: new Date().toISOString(),
            };
            logger_1.logger.startRequest(logData);
            await next(call, callback);
        }
        catch (error) {
            console.error('gRPC Request Interceptor Error:', error);
            const grpcError = {
                name: 'InternalError',
                message: 'Failed to process request context',
                code: grpc_js_1.status.INTERNAL,
                details: 'Internal server error',
                metadata: new grpc_js_1.Metadata(),
            };
            callback(grpcError, null);
        }
    };
}
