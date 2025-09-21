"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = success;
exports.created = created;
exports.error = error;
exports.badRequest = badRequest;
exports.notFound = notFound;
exports.internalServerError = internalServerError;
exports.unauthorized = unauthorized;
exports.forbidden = forbidden;
// presentation/grpc/responses/grpc.response.ts
const grpc_js_1 = require("@grpc/grpc-js");
const format_response_1 = __importDefault(require("../../../shared/responses/format.response"));
const code_1 = require("../../../shared/constants/code");
function success(callback, message, data) {
    const response = {
        ...format_response_1.default.success(code_1.INTERNAL_CODE.SUCCESS.OK.code, code_1.INTERNAL_CODE.SUCCESS.OK.status, message, data),
    };
    callback(null, response);
}
function created(callback, message, data) {
    const response = {
        ...format_response_1.default.success(code_1.INTERNAL_CODE.SUCCESS.CREATED.code, code_1.INTERNAL_CODE.SUCCESS.CREATED.status, message, data),
    };
    callback(null, response);
}
function error(callback, code, message, details) {
    const metadata = new grpc_js_1.Metadata();
    metadata.set('error-code', code.toString());
    metadata.set('error-message', message);
    const error = {
        name: 'GrpcError',
        message,
        code,
        details: typeof details === 'string' ? details : JSON.stringify(details),
        metadata,
    };
    callback(error, null);
}
function badRequest(callback, details) {
    error(callback, grpc_js_1.status.INVALID_ARGUMENT, 'Bad Request', details);
}
function notFound(callback, details) {
    error(callback, grpc_js_1.status.NOT_FOUND, 'Not Found', details);
}
function internalServerError(callback, details) {
    error(callback, grpc_js_1.status.INTERNAL, 'Internal Server Error', details);
}
function unauthorized(callback, details) {
    error(callback, grpc_js_1.status.UNAUTHENTICATED, 'Unauthorized', details);
}
function forbidden(callback, details) {
    error(callback, grpc_js_1.status.PERMISSION_DENIED, 'Forbidden', details);
}
