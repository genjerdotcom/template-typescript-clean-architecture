import ResponseFormat from '@app/shared/responses/format.response';
import { AppError, ErrorResponse, SuccessResponse, PaginationResponse } from '@app/shared/types';

describe('ResponseFormat', () => {
    describe('success()', () => {
        it('should return a proper SuccessResponse object', () => {
            const result = ResponseFormat.success('200', 'success', 'Operation successful', { name: 'John' });

            const expected: SuccessResponse<{ name: string }> = {
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
            const result = ResponseFormat.pagination('200', 'success', 'Data retrieved', 100, [{ id: 1 }, { id: 2 }]);

            const expected: PaginationResponse<{ id: number }[]> = {
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
            const appError: AppError = {
                data: { 
                    code: 'ERR001',
                    status: 'error',
                    message: 'Something went wrong',
                    reason: 'Unknown' 
                }
            };

            const result = ResponseFormat.error({ errors: appError });

            const expected: ErrorResponse = {
                errors: appError
            };

            expect(result).toEqual(expected);
        });

        it('should return multiple AppErrors wrapped in an object', () => {
            const appErrors: AppError[] = [
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

            const result = ResponseFormat.error({ errors: appErrors });

            const expected: ErrorResponse = {
                errors: appErrors
            };

            expect(result).toEqual(expected);
        });
    });
});
