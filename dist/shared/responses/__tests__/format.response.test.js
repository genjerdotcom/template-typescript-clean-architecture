"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const format_response_1 = __importDefault(require("../../../shared/responses/format.response"));
describe('ResponseFormat', () => {
    describe('success()', () => {
        it('should return a proper SuccessResponse object', () => {
            const result = format_response_1.default.success('200', 'success', 'Operation successful', { name: 'John' });
            const expected = {
                meta: {
                    code: '200',
                    status: 'success',
                    message: 'Operation successful',
                },
                data: { name: 'John' },
            };
            expect(result).toEqual(expected);
        });
    });
    describe('pagination()', () => {
        it('should return a proper PaginationResponse object', () => {
            const result = format_response_1.default.pagination('200', 'success', 'Data retrieved', 100, [{ id: 1 }, { id: 2 }]);
            const expected = {
                meta: {
                    code: '200',
                    status: 'success',
                    message: 'Data retrieved',
                },
                recordsTotal: 100,
                data: [{ id: 1 }, { id: 2 }],
            };
            expect(result).toEqual(expected);
        });
    });
    describe('error()', () => {
        it('should return a single AppError wrapped in an object', () => {
            const appError = {
                data: {
                    code: 'ERR001',
                    status: 'error',
                    message: 'Something went wrong',
                    reason: 'Unknown'
                }
            };
            const result = format_response_1.default.error({ errors: appError });
            const expected = {
                errors: appError
            };
            expect(result).toEqual(expected);
        });
        it('should return multiple AppErrors wrapped in an object', () => {
            const appErrors = [
                {
                    data: {
                        code: 'ERR001', status: 'error', message: 'Missing field', field: 'email'
                    }
                },
                {
                    data: {
                        code: 'ERR002', status: 'error', message: 'Missing field', field: 'password'
                    }
                }
            ];
            const result = format_response_1.default.error({ errors: appErrors });
            const expected = {
                errors: appErrors
            };
            expect(result).toEqual(expected);
        });
    });
});
