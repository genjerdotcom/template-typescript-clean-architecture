"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeInterceptors = composeInterceptors;
const grpc_js_1 = require("@grpc/grpc-js");
function composeInterceptors(interceptors, handler) {
    return (call, callback) => {
        const chain = interceptors.reduceRight((next, interceptor) => {
            return async (innerCall, innerCallback) => {
                try {
                    await interceptor(innerCall, next, innerCallback);
                }
                catch (err) {
                    console.error('[gRPC Interceptor Error]', err);
                    innerCallback({
                        code: grpc_js_1.status.INTERNAL,
                        message: err instanceof Error ? err.message : 'Unknown error',
                    }, null);
                }
            };
        }, handler);
        void chain(call, callback);
    };
}
