"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseFormat {
    static success(code, status, msg, data) {
        return {
            meta: {
                code,
                status,
                message: msg,
            },
            data,
        };
    }
    static pagination(code, status, msg, recordsTotal, data) {
        return {
            meta: {
                code,
                status,
                message: msg,
            },
            recordsTotal,
            data,
        };
    }
    static error(errors) {
        return errors;
    }
}
exports.default = ResponseFormat;
