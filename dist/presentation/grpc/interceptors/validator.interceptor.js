"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcValidateRequest = grpcValidateRequest;
const grpc_js_1 = require("@grpc/grpc-js");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function grpcValidateRequest(DtoClass) {
    return async (call, next, callback) => {
        const instance = (0, class_transformer_1.plainToInstance)(DtoClass, call.request);
        const errors = await (0, class_validator_1.validate)(instance);
        if (errors.length > 0) {
            const metadata = new grpc_js_1.Metadata();
            const messages = errors
                .map((e) => {
                const constraints = Object.values(e.constraints ?? {}).join(', ');
                return `${e.property}: ${constraints}`;
            }).join('; ');
            const grpcError = {
                name: 'BadRequest',
                message: messages,
                code: grpc_js_1.status.INVALID_ARGUMENT,
                details: messages,
                metadata,
            };
            callback(grpcError, null);
            return;
        }
        await next(call, callback);
    };
}
