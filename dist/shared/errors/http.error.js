"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const code_1 = require("../../shared/constants/code");
class AppError extends Error {
    constructor(message, errors, status) {
        super(message);
        this.name = this.constructor.name;
        this.errors = errors;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class HttpError {
    static notFound(errors) {
        return new AppError("Not Found", errors, code_1.HTTP_CODE.CLIENT_ERROR.NOT_FOUND.code);
    }
    static badRequest(errors) {
        return new AppError("Bad Request", errors, code_1.HTTP_CODE.CLIENT_ERROR.BAD_REQUEST.code);
    }
    static unAuthorize(errors) {
        return new AppError("Unauthorized", errors, code_1.HTTP_CODE.CLIENT_ERROR.UNAUTHORIZED.code);
    }
    static forbidden(errors) {
        return new AppError("Forbidden", errors, code_1.HTTP_CODE.CLIENT_ERROR.FORBIDDEN.code);
    }
    static internalServerError(errors) {
        return new AppError("Internal Server Error", errors, code_1.HTTP_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR.code);
    }
    static serviceRequestError(errors, status = 400) {
        return new AppError("Service Request Error", errors, status);
    }
}
exports.default = HttpError;
