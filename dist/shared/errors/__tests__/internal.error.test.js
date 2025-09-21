"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const internal_error_1 = require("../../../shared/errors/internal.error");
const internal_code_1 = __importDefault(require("../../../shared/constants/code/internal.code"));
const format_error_1 = __importDefault(require("../../../shared/errors/format.error"));
jest.mock('@app/shared/utils/translate.util', () => ({
    translateMessage: (_, key, vars) => `[translated] ${key} ${JSON.stringify(vars)}`
}));
jest.mock('@app/shared/constants/messages/errors', () => ({
    messages: () => ({})
}));
jest.mock('@app/shared/utils', () => ({
    langContext: {
        getLang: () => 'en'
    }
}));
describe('DomainError subclasses', () => {
    const baseData = { test: 'value' };
    const baseError = new Error('underlying');
    const testCases = [
        {
            name: 'ResourceNotFoundError',
            instance: new internal_error_1.ResourceNotFoundError('User', baseData, baseError),
            status: 404,
            code: internal_code_1.default.CLIENT_ERROR.NOT_FOUND.code
        },
        {
            name: 'InvalidBodyError',
            instance: new internal_error_1.InvalidBodyError('field', baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.BAD_REQUEST.code
        },
        {
            name: 'InCompleteKeyError',
            instance: new internal_error_1.InCompleteKeyError('key', baseData, 'header'),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.BAD_REQUEST_KEY.code
        },
        {
            name: 'InCompleteValueError',
            instance: new internal_error_1.InCompleteValueError('field', baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.BAD_REQUEST_VALUE.code
        },
        {
            name: 'InvalidEmailOrPasswordError',
            instance: new internal_error_1.InvalidEmailOrPasswordError(baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.INVALID_AUTH.code
        },
        {
            name: 'InvalidTypeError',
            instance: new internal_error_1.InvalidTypeError('field', baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.BAD_REQUEST_TYPE.code
        },
        {
            name: 'InvalidFileTypeError',
            instance: new internal_error_1.InvalidFileTypeError('image', 'must be png', baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.BAD_REQUEST_TYPE.code
        },
        {
            name: 'FindResourceError',
            instance: new internal_error_1.FindResourceError('User', baseData, baseError),
            status: 500,
            code: internal_code_1.default.SERVER_ERROR.FAILED_FIND_RESOURCE.code
        },
        {
            name: 'CreateResourceError',
            instance: new internal_error_1.CreateResourceError('User', baseData, baseError),
            status: 500,
            code: internal_code_1.default.SERVER_ERROR.FAILED_CREATE_RESOURCE.code
        },
        {
            name: 'UpdateResourceError',
            instance: new internal_error_1.UpdateResourceError('User', baseData, baseError),
            status: 500,
            code: internal_code_1.default.SERVER_ERROR.FAILED_UPDATE_RESOURCE.code
        },
        {
            name: 'DeleteResourceError',
            instance: new internal_error_1.DeleteResourceError('User', baseData, baseError),
            status: 500,
            code: internal_code_1.default.SERVER_ERROR.FAILED_DELETE_RESOURCE.code
        },
        {
            name: 'InvalidFormatError',
            instance: new internal_error_1.InvalidFormatError('email', baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.BAD_REQUEST_FORMAT.code
        },
        {
            name: 'AlreadyUsedError',
            instance: new internal_error_1.AlreadyUsedError('username', baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.DUPLICATE_VALUE.code
        },
        {
            name: 'InvalidOptionError',
            instance: new internal_error_1.InvalidOptionError('status', baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.OUTSIDE_OPTION.code
        },
        {
            name: 'LoginError',
            instance: new internal_error_1.LoginError(baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.INVALID_AUTH.code
        },
        {
            name: 'UnauthorizedError',
            instance: new internal_error_1.UnauthorizedError(baseData),
            status: 401,
            code: internal_code_1.default.CLIENT_ERROR.UNAUTHORIZED.code
        },
        {
            name: 'ExpiredError',
            instance: new internal_error_1.ExpiredError('token', baseData),
            status: 401,
            code: internal_code_1.default.CLIENT_ERROR.EXPIRED_AUTH.code
        },
        {
            name: 'InvalidMaxLengthError',
            instance: new internal_error_1.InvalidMaxLengthError('field', 10, baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.BAD_REQUEST.code
        },
        {
            name: 'InvalidMinLengthError',
            instance: new internal_error_1.InvalidMinLengthError('field', 3, baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.BAD_REQUEST.code
        },
        {
            name: 'InvalidMaxValueError',
            instance: new internal_error_1.InvalidMaxValueError('age', 99, baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.BAD_REQUEST.code
        },
        {
            name: 'InvalidMinValueError',
            instance: new internal_error_1.InvalidMinValueError('age', 18, baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.BAD_REQUEST.code
        },
        {
            name: 'MaxFileSizeError',
            instance: new internal_error_1.MaxFileSizeError('file', 5, baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.BAD_REQUEST.code
        },
        {
            name: 'Forbidden',
            instance: new internal_error_1.Forbidden('action', baseData),
            status: 403,
            code: internal_code_1.default.CLIENT_ERROR.FORBIDDEN.code
        },
        {
            name: 'GeneralError',
            instance: new internal_error_1.GeneralError('error', baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.GENERAL_ERRORS.code
        },
        {
            name: 'InvalidProcess',
            instance: new internal_error_1.InvalidProcess('process', baseData),
            status: 400,
            code: internal_code_1.default.CLIENT_ERROR.BAD_REQUEST.code
        },
        {
            name: 'ValueMissMatch',
            instance: new internal_error_1.ValueMissMatch('id', baseData, baseError),
            status: 500,
            code: internal_code_1.default.SERVER_ERROR.VALUE_MISSMATCH.code
        },
        {
            name: 'UnknownError',
            instance: new internal_error_1.UnknownError('something', baseData, baseError),
            status: 500,
            code: internal_code_1.default.SERVER_ERROR.INTERNAL_SERVER_ERROR.code
        }
    ];
    test.each(testCases)('$name should initialize properly', ({ name, instance, status, code }) => {
        expect(instance.constructor.name).toBe(name);
        expect(instance).toBeInstanceOf(internal_error_1.DomainError);
        expect(instance.status).toBe(status);
        expect(instance.data).toBeInstanceOf(format_error_1.default);
        expect(instance?.data?.code).toBe(code);
        expect(instance?.data?.data).toEqual(baseData);
        expect(typeof instance.message).toBe('string');
        expect(instance.message.startsWith('[translated]')).toBe(true);
    });
});
