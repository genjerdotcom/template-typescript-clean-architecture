"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const format_response_1 = __importDefault(require("../../../shared/responses/format.response"));
const code_1 = require("../../../shared/constants/code");
class HttpResponse {
    static success(res, message, data) {
        const response = format_response_1.default.success(code_1.INTERNAL_CODE.SUCCESS.OK.code, code_1.INTERNAL_CODE.SUCCESS.OK.status, message, data);
        res.status(code_1.HTTP_CODE.SUCCESS.OK.code).send(response);
    }
    static pagination(res, message, data, recordsTotal) {
        const response = format_response_1.default.pagination(code_1.INTERNAL_CODE.SUCCESS.OK.code, code_1.INTERNAL_CODE.SUCCESS.OK.status, message, recordsTotal, data);
        res.status(code_1.HTTP_CODE.SUCCESS.OK.code).send(response);
    }
    static downloadStream(res, filename) {
        res.status(code_1.HTTP_CODE.SUCCESS.OK.code).set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename=${filename}`,
        });
    }
    static created(res, message, data) {
        res.status(code_1.HTTP_CODE.SUCCESS.CREATED.code).send(format_response_1.default.success(code_1.INTERNAL_CODE.SUCCESS.CREATED.code, code_1.INTERNAL_CODE.SUCCESS.CREATED.status, message, data));
    }
    static notFound(res, errors) {
        res.status(code_1.HTTP_CODE.CLIENT_ERROR.NOT_FOUND.code).send(format_response_1.default.error(errors));
    }
    static badRequest(res, errors) {
        res.status(code_1.HTTP_CODE.CLIENT_ERROR.BAD_REQUEST.code).send(format_response_1.default.error(errors));
    }
    static unauthorized(res, errors) {
        res.status(code_1.HTTP_CODE.CLIENT_ERROR.UNAUTHORIZED.code).send(format_response_1.default.error(errors));
    }
    static forbidden(res, errors) {
        res.status(code_1.HTTP_CODE.CLIENT_ERROR.FORBIDDEN.code).send(format_response_1.default.error(errors));
    }
    static internalServerError(res, errors) {
        res.status(code_1.HTTP_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR.code).send(format_response_1.default.error(errors));
    }
    static errorHandler(res, responseCode, errors) {
        switch (responseCode) {
            case code_1.HTTP_CODE.CLIENT_ERROR.NOT_FOUND.code: {
                this.notFound(res, errors);
                break;
            }
            case code_1.HTTP_CODE.CLIENT_ERROR.BAD_REQUEST.code: {
                this.badRequest(res, errors);
                break;
            }
            case code_1.HTTP_CODE.CLIENT_ERROR.UNAUTHORIZED.code: {
                this.unauthorized(res, errors);
                break;
            }
            case code_1.HTTP_CODE.CLIENT_ERROR.FORBIDDEN.code: {
                this.forbidden(res, errors);
                break;
            }
            case code_1.HTTP_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR.code: {
                this.internalServerError(res, errors);
                break;
            }
            default: {
                this.internalServerError(res, errors);
                break;
            }
        }
    }
}
exports.default = HttpResponse;
