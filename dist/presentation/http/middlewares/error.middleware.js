"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.globalErrorHandler = globalErrorHandler;
const http_response_1 = __importDefault(require("../../../presentation/http/responses/http.response"));
const errors_1 = require("../../../shared/errors");
const logger_1 = require("../../../infrastructure/logger");
const types_1 = require("../../../shared/types");
function notFoundHandler(_req, _res, next) {
    next(errors_1.HttpError.notFound(new errors_1.InternalError.ResourceNotFoundError('URL')));
}
function globalErrorHandler(err, _req, res, next) {
    const rawErrors = err.errors ?? err;
    let appErrors = [];
    if (Array.isArray(rawErrors)) {
        appErrors = rawErrors.map((e) => {
            if ((0, types_1.isAppError)(e))
                return e;
            return e;
        });
    }
    else if ((0, types_1.isAppError)(rawErrors)) {
        appErrors = [rawErrors.data];
    }
    else {
        appErrors = [rawErrors];
    }
    let { originalError } = err;
    if (appErrors[0] instanceof Error) {
        [originalError] = appErrors;
        appErrors = [new errors_1.InternalError.UnknownError().data];
    }
    const status = err.status ?? err.http_status ?? 500;
    logger_1.logger.errorException(res, {
        status,
        appErrors,
        originalError,
    });
    http_response_1.default.errorHandler(res, status, {
        meta: { 'request-id': res.locals.requestId },
        errors: appErrors
    });
    next();
}
