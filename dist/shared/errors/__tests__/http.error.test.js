"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const http_error_1 = __importStar(require("../../../shared/errors/http.error"));
const code_1 = require("../../../shared/constants/code");
describe('AppError', () => {
    it('should create an AppError instance with correct values', () => {
        const error = new http_error_1.AppError('Test Error', { detail: 'Something went wrong' }, 400);
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(http_error_1.AppError);
        expect(error.message).toBe('Test Error');
        expect(error.errors).toEqual({ detail: 'Something went wrong' });
        expect(error.status).toBe(400);
        expect(error.name).toBe('AppError');
        expect(error.stack).toBeDefined();
    });
});
describe('HttpError static methods', () => {
    const dummyError = { reason: 'Invalid data' };
    it('should return AppError from notFound()', () => {
        const error = http_error_1.default.notFound(dummyError);
        expect(error).toBeInstanceOf(http_error_1.AppError);
        expect(error.message).toBe('Not Found');
        expect(error.status).toBe(code_1.HTTP_CODE.CLIENT_ERROR.NOT_FOUND.code);
        expect(error.errors).toBe(dummyError);
    });
    it('should return AppError from badRequest()', () => {
        const error = http_error_1.default.badRequest(dummyError);
        expect(error.message).toBe('Bad Request');
        expect(error.status).toBe(code_1.HTTP_CODE.CLIENT_ERROR.BAD_REQUEST.code);
    });
    it('should return AppError from unAuthorize()', () => {
        const error = http_error_1.default.unAuthorize(dummyError);
        expect(error.message).toBe('Unauthorized');
        expect(error.status).toBe(code_1.HTTP_CODE.CLIENT_ERROR.UNAUTHORIZED.code);
    });
    it('should return AppError from forbidden()', () => {
        const error = http_error_1.default.forbidden(dummyError);
        expect(error.message).toBe('Forbidden');
        expect(error.status).toBe(code_1.HTTP_CODE.CLIENT_ERROR.FORBIDDEN.code);
    });
    it('should return AppError from internalServerError()', () => {
        const error = http_error_1.default.internalServerError(dummyError);
        expect(error.message).toBe('Internal Server Error');
        expect(error.status).toBe(code_1.HTTP_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR.code);
    });
    it('should return AppError from serviceRequestError() with custom status', () => {
        const error = http_error_1.default.serviceRequestError(dummyError, 418);
        expect(error.message).toBe('Service Request Error');
        expect(error.status).toBe(418);
    });
    it('should return AppError from serviceRequestError() with default status', () => {
        const error = http_error_1.default.serviceRequestError(dummyError);
        expect(error.status).toBe(400);
    });
});
