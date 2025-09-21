"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAppError = isAppError;
function isAppError(error) {
    return typeof error === 'object' && error !== null && 'data' in error;
}
