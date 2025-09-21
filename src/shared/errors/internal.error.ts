import INTERNAL_CODE from "@app/shared/constants/code/internal.code";
import ErrorFormat from "@app/shared/errors/format.error";
import { translateMessage } from '@app/shared/utils/translate.util';
import { messages } from '@app/shared/constants/messages/errors'; 
import { langContext } from '@app/shared/utils';

interface IDomainError<T = unknown> {
    data?: ErrorFormat<T | undefined>;
    status?: number;
    originalError?: Error;
}

class DomainError<T = unknown> extends Error implements IDomainError<T> {
    public data?: ErrorFormat<T | undefined>;
    public status?: number;
    public originalError?: Error;

    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ResourceNotFoundError<T> extends DomainError<T> {
    constructor(key: string, data?: T, error?: Error) {
        super(translateMessage(messages(langContext.getLang()), 'notFoundResource', { key }));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.NOT_FOUND, this.message, data);
        this.status = 404;
        this.originalError = error;
    }
}

class ValueMissMatch<T> extends DomainError<T> {
    constructor(key: string, data: T, error: Error) {
        super(translateMessage(messages(langContext.getLang()), 'somethingWentWrong', { key }));
        this.data = new ErrorFormat(INTERNAL_CODE.SERVER_ERROR.VALUE_MISSMATCH, this.message, data);
        this.status = 500;
        this.originalError = error;
    }
}

class InvalidBodyError<T> extends DomainError<T> {
    constructor(key: string, data: T) {
        super(translateMessage(messages(langContext.getLang()), 'invalidBody', { key }));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}

class InCompleteKeyError<T> extends DomainError<T> {
    constructor(key: string, data?: T, placement = '') {
        super(translateMessage(messages(langContext.getLang()), 'incompleteKey', { key, placement }));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST_KEY, this.message, data);
        this.status = 400;
    }
}

class InCompleteValueError<T> extends DomainError<T> {
    constructor(key: string, data: T, placement = 'body') {
        super(translateMessage(messages(langContext.getLang()), 'incompleteValue', { key, placement }));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST_VALUE, this.message, data);
        this.status = 400;
    }
}

class InvalidEmailOrPasswordError<T> extends DomainError<T> {
    constructor(data: T) {
        super(translateMessage(messages(langContext.getLang()), 'invalidEmailOrPassword', {}));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.INVALID_AUTH, this.message, data);
        this.status = 400;
    }
}

class InvalidTypeError<T> extends DomainError<T> {
    constructor(key: string, data?: T) {
        super(translateMessage(messages(langContext.getLang()), 'invalidType', { key }));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST_TYPE, this.message, data);
        this.status = 400;
    }
}

class InvalidFileTypeError<T> extends DomainError<T> {
    constructor(key: string, message: string, data?: T) {
        super(translateMessage(messages(langContext.getLang()), 'invalidFileType', { key, message }));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST_TYPE, this.message, data);
        this.status = 400;
    }
}

class FindResourceError<T> extends DomainError<T> {
    constructor(key: string, data: T, error: Error) {
        super(translateMessage(messages(langContext.getLang()), 'errorFindResource', { key }));
        this.data = new ErrorFormat(INTERNAL_CODE.SERVER_ERROR.FAILED_FIND_RESOURCE, this.message, data);
        this.originalError = error;
        this.status = 500;
    }
}

class CreateResourceError<T> extends DomainError<T> {
    constructor(key: string, data: T, error: Error) {
        super(translateMessage(messages(langContext.getLang()), 'errorCreateResource', { key }));
        this.data = new ErrorFormat(INTERNAL_CODE.SERVER_ERROR.FAILED_CREATE_RESOURCE, this.message, data);
        this.originalError = error;
        this.status = 500;
    }
}

class UpdateResourceError<T> extends DomainError<T> {
    constructor(key: string, data: T, error: Error) {
        super(translateMessage(messages(langContext.getLang()), 'errorUpdateResource', { key }));
        this.data = new ErrorFormat(INTERNAL_CODE.SERVER_ERROR.FAILED_UPDATE_RESOURCE, this.message, data);
        this.originalError = error;
        this.status = 500;
    }
}

class DeleteResourceError<T> extends DomainError<T> {
    constructor(key: string, data: T, error: Error) {
        super(translateMessage(messages(langContext.getLang()), 'errorDeleteResource', { key }));
        this.data = new ErrorFormat(INTERNAL_CODE.SERVER_ERROR.FAILED_DELETE_RESOURCE, this.message, data);
        this.originalError = error;
        this.status = 500;
    }
}

class InvalidFormatError<T> extends DomainError<T> {
    constructor(key: string, data: T) {
        super(translateMessage(messages(langContext.getLang()), 'invalidFormat', { key }));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST_FORMAT,this.message, data);
        this.status = 400;
    }
}

class AlreadyUsedError<T> extends DomainError<T> {
    constructor(key: string, data?: T) {
        super(translateMessage(messages(langContext.getLang()), 'alreadyUsed', { key }));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.DUPLICATE_VALUE, this.message, data);
        this.status = 400;
    }
}

class InvalidOptionError<T> extends DomainError<T> {
    constructor(key: string, data: T) {
        super(translateMessage(messages(langContext.getLang()), 'invalidOption', { key }));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.OUTSIDE_OPTION, this.message, data);
        this.status = 400;
    }
}

class LoginError<T> extends DomainError<T> {
    constructor(data: T) {
        super(translateMessage(messages(langContext.getLang()), 'loginError', {}));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.INVALID_AUTH, this.message, data);
        this.status = 400;
    }
}

class UnauthorizedError<T> extends DomainError<T> {
    constructor(data?: T) {
        super(translateMessage(messages(langContext.getLang()), 'unauthorized', {}));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.UNAUTHORIZED, this.message, data);
        this.status = 401;
    }
}

class ExpiredError<T> extends DomainError<T> {
    constructor(key: string, data?: T) {
        super(translateMessage(messages(langContext.getLang()), 'expired', {key}));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.EXPIRED_AUTH, this.message, data);
        this.status = 401;
    }
}

class InvalidMaxLengthError<T> extends DomainError<T> {
    constructor(key: string, value: number, data?: T) {
        super(translateMessage(messages(langContext.getLang()), 'invalidMaxLength', {key, value}));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}

class InvalidMinLengthError<T> extends DomainError<T> {
    constructor(key: string, value: number, data?: T) {
        super(translateMessage(messages(langContext.getLang()), 'invalidMinLength', {key, value}));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}

class InvalidMaxValueError<T> extends DomainError<T> {
    constructor(key: string, value: number, data?: T) {
        super(translateMessage(messages(langContext.getLang()), 'invalidMaxValue', {key, value}));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}

class InvalidMinValueError<T> extends DomainError<T> {
    constructor(key: string, value: number, data?: T) {
        super(translateMessage(messages(langContext.getLang()), 'invalidMinValue', {key, value}));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}

class MaxFileSizeError<T> extends DomainError<T> {
    constructor(key: string, value: number, data: T) {
        super(translateMessage(messages(langContext.getLang()), 'maxFileSize', {key}));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}

class Forbidden<T> extends DomainError<T> {
    constructor(key?: string, data?: T) {
        super(translateMessage(messages(langContext.getLang()), 'forbidden', {}));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.FORBIDDEN, this.message, data);
        this.status = 403;
    }
}

class GeneralError<T> extends DomainError<T> {
    constructor(key: string, data: T) {
        super(translateMessage(messages(langContext.getLang()), 'generalRequestErrors', {key}));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.GENERAL_ERRORS, this.message, data);
        this.status = 400;
    }
}

class InvalidProcess<T> extends DomainError<T> {
    constructor(key: string, data: T) {
        super(translateMessage(messages(langContext.getLang()), 'invalidProcess', {key}));
        this.data = new ErrorFormat(INTERNAL_CODE.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}

class UnknownError<T> extends DomainError<T> {
    constructor(key?: string, data?: T, error?: Error) {
        super(translateMessage(messages(langContext.getLang()), 'somethingWentWrong', {}));
        this.data = new ErrorFormat(INTERNAL_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR, this.message, data);
        this.originalError = error;
        this.status = 500;
    }
}

export {
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
    Forbidden,
    MaxFileSizeError,
    GeneralError,
    InvalidProcess,
    ValueMissMatch,
    UnknownError,
    DomainError
};