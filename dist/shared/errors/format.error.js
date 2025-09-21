"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorFormat {
    constructor(internalCode, message, data) {
        this.code = internalCode.code;
        this.status = internalCode.status;
        this.message = message;
        this.data = data;
    }
}
exports.default = ErrorFormat;
