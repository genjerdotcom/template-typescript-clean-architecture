"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainError = exports.UnknownError = exports.ValueMissMatch = exports.InvalidProcess = exports.GeneralError = exports.MaxFileSizeError = exports.Forbidden = exports.InvalidMinValueError = exports.InvalidMaxValueError = exports.InvalidMinLengthError = exports.InvalidMaxLengthError = exports.ExpiredError = exports.UnauthorizedError = exports.LoginError = exports.InvalidOptionError = exports.AlreadyUsedError = exports.InvalidFormatError = exports.DeleteResourceError = exports.UpdateResourceError = exports.CreateResourceError = exports.FindResourceError = exports.InvalidFileTypeError = exports.InvalidTypeError = exports.InvalidEmailOrPasswordError = exports.InCompleteValueError = exports.InCompleteKeyError = exports.InvalidBodyError = exports.ResourceNotFoundError = void 0;
const internal_code_1 = __importDefault(require("../../shared/constants/code/internal.code"));
const format_error_1 = __importDefault(require("../../shared/errors/format.error"));
const translate_util_1 = require("../../shared/utils/translate.util");
const errors_1 = require("../../shared/constants/messages/errors");
const utils_1 = require("../../shared/utils");
class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DomainError = DomainError;
class ResourceNotFoundError extends DomainError {
    constructor(key, data, error) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'notFoundResource', { key }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.NOT_FOUND, this.message, data);
        this.status = 404;
        this.originalError = error;
    }
}
exports.ResourceNotFoundError = ResourceNotFoundError;
class ValueMissMatch extends DomainError {
    constructor(key, data, error) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'somethingWentWrong', { key }));
        this.data = new format_error_1.default(internal_code_1.default.SERVER_ERROR.VALUE_MISSMATCH, this.message, data);
        this.status = 500;
        this.originalError = error;
    }
}
exports.ValueMissMatch = ValueMissMatch;
class InvalidBodyError extends DomainError {
    constructor(key, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'invalidBody', { key }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}
exports.InvalidBodyError = InvalidBodyError;
class InCompleteKeyError extends DomainError {
    constructor(key, data, placement = '') {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'incompleteKey', { key, placement }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.BAD_REQUEST_KEY, this.message, data);
        this.status = 400;
    }
}
exports.InCompleteKeyError = InCompleteKeyError;
class InCompleteValueError extends DomainError {
    constructor(key, data, placement = 'body') {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'incompleteValue', { key, placement }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.BAD_REQUEST_VALUE, this.message, data);
        this.status = 400;
    }
}
exports.InCompleteValueError = InCompleteValueError;
class InvalidEmailOrPasswordError extends DomainError {
    constructor(data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'invalidEmailOrPassword', {}));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.INVALID_AUTH, this.message, data);
        this.status = 400;
    }
}
exports.InvalidEmailOrPasswordError = InvalidEmailOrPasswordError;
class InvalidTypeError extends DomainError {
    constructor(key, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'invalidType', { key }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.BAD_REQUEST_TYPE, this.message, data);
        this.status = 400;
    }
}
exports.InvalidTypeError = InvalidTypeError;
class InvalidFileTypeError extends DomainError {
    constructor(key, message, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'invalidFileType', { key, message }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.BAD_REQUEST_TYPE, this.message, data);
        this.status = 400;
    }
}
exports.InvalidFileTypeError = InvalidFileTypeError;
class FindResourceError extends DomainError {
    constructor(key, data, error) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'errorFindResource', { key }));
        this.data = new format_error_1.default(internal_code_1.default.SERVER_ERROR.FAILED_FIND_RESOURCE, this.message, data);
        this.originalError = error;
        this.status = 500;
    }
}
exports.FindResourceError = FindResourceError;
class CreateResourceError extends DomainError {
    constructor(key, data, error) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'errorCreateResource', { key }));
        this.data = new format_error_1.default(internal_code_1.default.SERVER_ERROR.FAILED_CREATE_RESOURCE, this.message, data);
        this.originalError = error;
        this.status = 500;
    }
}
exports.CreateResourceError = CreateResourceError;
class UpdateResourceError extends DomainError {
    constructor(key, data, error) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'errorUpdateResource', { key }));
        this.data = new format_error_1.default(internal_code_1.default.SERVER_ERROR.FAILED_UPDATE_RESOURCE, this.message, data);
        this.originalError = error;
        this.status = 500;
    }
}
exports.UpdateResourceError = UpdateResourceError;
class DeleteResourceError extends DomainError {
    constructor(key, data, error) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'errorDeleteResource', { key }));
        this.data = new format_error_1.default(internal_code_1.default.SERVER_ERROR.FAILED_DELETE_RESOURCE, this.message, data);
        this.originalError = error;
        this.status = 500;
    }
}
exports.DeleteResourceError = DeleteResourceError;
class InvalidFormatError extends DomainError {
    constructor(key, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'invalidFormat', { key }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.BAD_REQUEST_FORMAT, this.message, data);
        this.status = 400;
    }
}
exports.InvalidFormatError = InvalidFormatError;
class AlreadyUsedError extends DomainError {
    constructor(key, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'alreadyUsed', { key }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.DUPLICATE_VALUE, this.message, data);
        this.status = 400;
    }
}
exports.AlreadyUsedError = AlreadyUsedError;
class InvalidOptionError extends DomainError {
    constructor(key, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'invalidOption', { key }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.OUTSIDE_OPTION, this.message, data);
        this.status = 400;
    }
}
exports.InvalidOptionError = InvalidOptionError;
class LoginError extends DomainError {
    constructor(data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'loginError', {}));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.INVALID_AUTH, this.message, data);
        this.status = 400;
    }
}
exports.LoginError = LoginError;
class UnauthorizedError extends DomainError {
    constructor(data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'unauthorized', {}));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.UNAUTHORIZED, this.message, data);
        this.status = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ExpiredError extends DomainError {
    constructor(key, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'expired', { key }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.EXPIRED_AUTH, this.message, data);
        this.status = 401;
    }
}
exports.ExpiredError = ExpiredError;
class InvalidMaxLengthError extends DomainError {
    constructor(key, value, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'invalidMaxLength', { key, value }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}
exports.InvalidMaxLengthError = InvalidMaxLengthError;
class InvalidMinLengthError extends DomainError {
    constructor(key, value, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'invalidMinLength', { key, value }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}
exports.InvalidMinLengthError = InvalidMinLengthError;
class InvalidMaxValueError extends DomainError {
    constructor(key, value, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'invalidMaxValue', { key, value }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}
exports.InvalidMaxValueError = InvalidMaxValueError;
class InvalidMinValueError extends DomainError {
    constructor(key, value, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'invalidMinValue', { key, value }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}
exports.InvalidMinValueError = InvalidMinValueError;
class MaxFileSizeError extends DomainError {
    constructor(key, value, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'maxFileSize', { key }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}
exports.MaxFileSizeError = MaxFileSizeError;
class Forbidden extends DomainError {
    constructor(key, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'forbidden', {}));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.FORBIDDEN, this.message, data);
        this.status = 403;
    }
}
exports.Forbidden = Forbidden;
class GeneralError extends DomainError {
    constructor(key, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'generalRequestErrors', { key }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.GENERAL_ERRORS, this.message, data);
        this.status = 400;
    }
}
exports.GeneralError = GeneralError;
class InvalidProcess extends DomainError {
    constructor(key, data) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'invalidProcess', { key }));
        this.data = new format_error_1.default(internal_code_1.default.CLIENT_ERROR.BAD_REQUEST, this.message, data);
        this.status = 400;
    }
}
exports.InvalidProcess = InvalidProcess;
class UnknownError extends DomainError {
    constructor(key, data, error) {
        super((0, translate_util_1.translateMessage)((0, errors_1.messages)(utils_1.langContext.getLang()), 'somethingWentWrong', {}));
        this.data = new format_error_1.default(internal_code_1.default.SERVER_ERROR.INTERNAL_SERVER_ERROR, this.message, data);
        this.originalError = error;
        this.status = 500;
    }
}
exports.UnknownError = UnknownError;
