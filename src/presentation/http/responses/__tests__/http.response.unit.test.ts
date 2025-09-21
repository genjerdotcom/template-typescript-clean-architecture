import HttpResponse from '@app/presentation/http/responses/http.response';
import ResponseFormat from '@app/shared/responses/format.response';
import { INTERNAL_CODE, HTTP_CODE } from '@app/shared/constants/code';
import { AppError } from '@app/shared/types';
import { Response } from 'express';

jest.mock('@app/shared/responses/format.response');

const mockSend = jest.fn();
const mockSet = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
    send: mockSend,
    set: mockSet,
}));

const createMockRes = () =>
    ({
        status: mockStatus,
    } as unknown as Response);

beforeEach(() => {
    jest.clearAllMocks();
});

describe('HttpResponse', () => {
    const mockData = { id: 1 };
    const mockMessage = 'Success';
    const mockErrors = {
        errors: [
        {
            code: 'E001',
            status: 400,
            message: 'Bad request',
        },
        ],
    } satisfies { errors: AppError[] };

    it('should send success response', () => {
        const res = createMockRes();
        const responseBody = { success: true };

        (ResponseFormat.success as jest.Mock).mockReturnValue(responseBody);

        HttpResponse.success(res, mockMessage, mockData);

        expect(ResponseFormat.success).toHaveBeenCalledWith(
            INTERNAL_CODE.SUCCESS.OK.code,
            INTERNAL_CODE.SUCCESS.OK.status,
            mockMessage,
            mockData
        );
        expect(mockStatus).toHaveBeenCalledWith(HTTP_CODE.SUCCESS.OK.code);
        expect(mockSend).toHaveBeenCalledWith(responseBody);
    });

    it('should send pagination response', () => {
        const res = createMockRes();
        const responseBody = { paginated: true };

        (ResponseFormat.pagination as jest.Mock).mockReturnValue(responseBody);

        HttpResponse.pagination(res, mockMessage, mockData, 10);

        expect(ResponseFormat.pagination).toHaveBeenCalledWith(
            INTERNAL_CODE.SUCCESS.OK.code,
            INTERNAL_CODE.SUCCESS.OK.status,
            mockMessage,
            10,
            mockData
        );
        expect(mockSend).toHaveBeenCalledWith(responseBody);
    });

    it('should set headers for file download', () => {
        const res = createMockRes();
        const filename = 'test.csv';

        HttpResponse.downloadStream(res, filename);

        expect(mockStatus).toHaveBeenCalledWith(HTTP_CODE.SUCCESS.OK.code);
        expect(mockSet).toHaveBeenCalledWith({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename=${filename}`,
        });
    });

    it('should send created response', () => {
        const res = createMockRes();
        const responseBody = { created: true };

        (ResponseFormat.success as jest.Mock).mockReturnValue(responseBody);

        HttpResponse.created(res, mockMessage, mockData);

        expect(ResponseFormat.success).toHaveBeenCalledWith(
            INTERNAL_CODE.SUCCESS.CREATED.code,
            INTERNAL_CODE.SUCCESS.CREATED.status,
            mockMessage,
            mockData
        );
        expect(mockStatus).toHaveBeenCalledWith(HTTP_CODE.SUCCESS.CREATED.code);
        expect(mockSend).toHaveBeenCalledWith(responseBody);
    });

    it.each([
        ['notFound', HttpResponse.notFound, HTTP_CODE.CLIENT_ERROR.NOT_FOUND.code],
        ['badRequest', HttpResponse.badRequest, HTTP_CODE.CLIENT_ERROR.BAD_REQUEST.code],
        ['unauthorized', HttpResponse.unauthorized, HTTP_CODE.CLIENT_ERROR.UNAUTHORIZED.code],
        ['forbidden', HttpResponse.forbidden, HTTP_CODE.CLIENT_ERROR.FORBIDDEN.code],
        ['internalServerError', HttpResponse.internalServerError, HTTP_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR.code],
    ])('should handle %s error', (_name, method, expectedCode) => {
        const res = createMockRes();
        const responseBody = { error: true };

        (ResponseFormat.error as jest.Mock).mockReturnValue(responseBody);

        method(res, mockErrors);

        expect(mockStatus).toHaveBeenCalledWith(expectedCode);
        expect(mockSend).toHaveBeenCalledWith(responseBody);
    });

    describe('errorHandler', () => {
        it('should delegate to the correct error method', () => {
            const res = createMockRes();
            const spy = jest.spyOn(HttpResponse, 'notFound');

            HttpResponse.errorHandler(res, HTTP_CODE.CLIENT_ERROR.NOT_FOUND.code, mockErrors);

            expect(spy).toHaveBeenCalledWith(res, mockErrors);
        });

        it('should fallback to internalServerError on unknown code', () => {
            const res = createMockRes();
            const spy = jest.spyOn(HttpResponse, 'internalServerError');

            HttpResponse.errorHandler(res, 500, mockErrors);

            expect(spy).toHaveBeenCalledWith(res, mockErrors);
        });
    });
});
