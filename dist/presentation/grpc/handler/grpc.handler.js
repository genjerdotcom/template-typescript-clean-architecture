"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapUnaryHandler = wrapUnaryHandler;
exports.registerGrpcHandlers = registerGrpcHandlers;
const register_grpc_handler_1 = require("../../../modules/register.grpc.handler");
const load_proto_1 = require("../../../presentation/grpc/proto/load.proto");
const interceptors_1 = require("../../../presentation/grpc/interceptors");
const error_interceptor_1 = require("../../../presentation/grpc/interceptors/error.interceptor");
function wrapUnaryHandler(handler) {
    return async (call, callback) => {
        await new Promise((resolve, reject) => {
            try {
                handler(call, callback);
                resolve();
            }
            catch (error) {
                reject(error instanceof Error ? error : new Error(String(error)));
            }
        });
    };
}
function registerGrpcHandlers(server) {
    for (const handlerGroup of register_grpc_handler_1.grpcHandlerGroups) {
        const { serviceName, moduleName, handlers } = handlerGroup;
        const serviceDefinition = (0, load_proto_1.loadProto)(serviceName, moduleName);
        const wrappedHandlers = {};
        for (const methodName of Object.keys(handlers)) {
            const originalHandler = handlers[methodName];
            const composed = (0, interceptors_1.composeInterceptors)([(0, interceptors_1.grpcRequestInterceptor)(String(methodName)), error_interceptor_1.errorInterceptor], wrapUnaryHandler(originalHandler));
            wrappedHandlers[methodName] = composed;
        }
        server.addService(serviceDefinition, wrappedHandlers);
    }
}
