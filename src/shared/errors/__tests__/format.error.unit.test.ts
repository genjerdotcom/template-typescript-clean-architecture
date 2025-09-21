import ErrorFormat from "@app/shared/errors/format.error";

describe('ErrorFormat', () => {
    it('should construct correctly with given parameters', () => {
        const errorCode = {
            code: 'USER_NOT_FOUND',
            status: '404',
        };
        const error = new ErrorFormat(errorCode, 'User not found', { id: '123' });

        expect(error.code).toBe('USER_NOT_FOUND');
        expect(error.status).toBe('404');
        expect(error.message).toBe('User not found');
        expect(error.data).toEqual({ id: '123' });
    });
});