import {
    ResourceNotFoundError,
    InvalidBodyError,
    InCompleteKeyError,
    InCompleteValueError,
    InvalidEmailOrPasswordError,
    InvalidTypeError,
    InvalidFileTypeError,
    FindResourceError,
    CreateResourceError,
    UpdateResourceError,
    DeleteResourceError,
    InvalidFormatError,
    AlreadyUsedError,
    InvalidOptionError,
    LoginError,
    UnauthorizedError,
    ExpiredError,
    InvalidMaxLengthError,
    InvalidMinLengthError,
    InvalidMaxValueError,
    InvalidMinValueError,
    MaxFileSizeError,
    Forbidden,
    GeneralError,
    InvalidProcess,
    ValueMissMatch,
    UnknownError,
    DomainError
} from '@app/shared/errors/internal.error';

import INTERNAL_CODE from '@app/shared/constants/code/internal.code';
import ErrorFormat from '@app/shared/errors/format.error';

jest.mock('@app/shared/utils/translate.util', () => ({
    translateMessage: (_: unknown, key: string, vars: Record<string, unknown>) =>
        `[translated] ${key} ${JSON.stringify(vars)}`
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
            instance: new ResourceNotFoundError('User', baseData, baseError),
            status: 404,
            code: INTERNAL_CODE.CLIENT_ERROR.NOT_FOUND.code 
        },
        {
            name: 'InvalidBodyError',
            instance: new InvalidBodyError('field', baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST.code 
        },
        {
            name: 'InCompleteKeyError',
            instance: new InCompleteKeyError('key', baseData, 'header'),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST_KEY.code 
        },
        {
            name: 'InCompleteValueError',
            instance: new InCompleteValueError('field', baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST_VALUE.code 
        },
        {
            name: 'InvalidEmailOrPasswordError',
            instance: new InvalidEmailOrPasswordError(baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.INVALID_AUTH.code 
        },
        {
            name: 'InvalidTypeError',
            instance: new InvalidTypeError('field', baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST_TYPE.code 
        },
        {
            name: 'InvalidFileTypeError',
            instance: new InvalidFileTypeError('image', 'must be png', baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST_TYPE.code 
        },
        {
            name: 'FindResourceError',
            instance: new FindResourceError('User', baseData, baseError),
            status: 500,
            code: INTERNAL_CODE.SERVER_ERROR.FAILED_FIND_RESOURCE.code 
        },
        {
            name: 'CreateResourceError',
            instance: new CreateResourceError('User', baseData, baseError),
            status: 500,
            code: INTERNAL_CODE.SERVER_ERROR.FAILED_CREATE_RESOURCE.code 
        },
        {
            name: 'UpdateResourceError',
            instance: new UpdateResourceError('User', baseData, baseError),
            status: 500,
            code: INTERNAL_CODE.SERVER_ERROR.FAILED_UPDATE_RESOURCE.code 
        },
        {
            name: 'DeleteResourceError',
            instance: new DeleteResourceError('User', baseData, baseError),
            status: 500,
            code: INTERNAL_CODE.SERVER_ERROR.FAILED_DELETE_RESOURCE.code 
        },
        {
            name: 'InvalidFormatError',
            instance: new InvalidFormatError('email', baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST_FORMAT.code 
        },
        {
            name: 'AlreadyUsedError',
            instance: new AlreadyUsedError('username', baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.DUPLICATE_VALUE.code 
        },
        {
            name: 'InvalidOptionError',
            instance: new InvalidOptionError('status', baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.OUTSIDE_OPTION.code 
        },
        {
            name: 'LoginError',
            instance: new LoginError(baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.INVALID_AUTH.code 
        },
        {
            name: 'UnauthorizedError',
            instance: new UnauthorizedError(baseData),
            status: 401,
            code: INTERNAL_CODE.CLIENT_ERROR.UNAUTHORIZED.code 
        },
        {
            name: 'ExpiredError',
            instance: new ExpiredError('token', baseData),
            status: 401,
            code: INTERNAL_CODE.CLIENT_ERROR.EXPIRED_AUTH.code 
        },
        {
            name: 'InvalidMaxLengthError',
            instance: new InvalidMaxLengthError('field', 10, baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST.code 
        },
        {
            name: 'InvalidMinLengthError',
            instance: new InvalidMinLengthError('field', 3, baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST.code 
        },
        {
            name: 'InvalidMaxValueError',
            instance: new InvalidMaxValueError('age', 99, baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST.code 
        },
        {
            name: 'InvalidMinValueError',
            instance: new InvalidMinValueError('age', 18, baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST.code 
        },
        {
            name: 'MaxFileSizeError',
            instance: new MaxFileSizeError('file', 5, baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST.code 
        },
        {
            name: 'Forbidden',
            instance: new Forbidden('action', baseData),
            status: 403,
            code: INTERNAL_CODE.CLIENT_ERROR.FORBIDDEN.code 
        },
        {
            name: 'GeneralError',
            instance: new GeneralError('error', baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.GENERAL_ERRORS.code 
        },
        {
            name: 'InvalidProcess',
            instance: new InvalidProcess('process', baseData),
            status: 400,
            code: INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST.code 
        },
        {
            name: 'ValueMissMatch',
            instance: new ValueMissMatch('id', baseData, baseError),
            status: 500,
            code: INTERNAL_CODE.SERVER_ERROR.VALUE_MISSMATCH.code 
        },
        {
            name: 'UnknownError',
            instance: new UnknownError('something', baseData, baseError),
            status: 500,
            code: INTERNAL_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR.code 
        }
    ] as const;

    test.each(testCases)(
        '$name should initialize properly',
        ({ name, instance, status, code }) => {
            expect(instance.constructor.name).toBe(name);
            expect(instance).toBeInstanceOf(DomainError);
            expect(instance.status).toBe(status);
            expect(instance.data).toBeInstanceOf(ErrorFormat);
            expect(instance?.data?.code).toBe(code);
            expect(instance?.data?.data).toEqual(baseData);
            expect(typeof instance.message).toBe('string');
            expect(instance.message.startsWith('[translated]')).toBe(true);
        }
    );
});
