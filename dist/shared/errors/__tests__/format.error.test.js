"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const format_error_1 = __importDefault(require("../../../shared/errors/format.error"));
describe('ErrorFormat', () => {
    it('should construct correctly with given parameters', () => {
        const errorCode = {
            code: 'USER_NOT_FOUND',
            status: '404',
        };
        const error = new format_error_1.default(errorCode, 'User not found', { id: '123' });
        expect(error.code).toBe('USER_NOT_FOUND');
        expect(error.status).toBe('404');
        expect(error.message).toBe('User not found');
        expect(error.data).toEqual({ id: '123' });
    });
});
