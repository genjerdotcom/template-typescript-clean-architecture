"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLogger = void 0;
const flatted_1 = __importDefault(require("flatted"));
const lodash_1 = require("lodash");
const transaporter_1 = __importDefault(require("../../../infrastructure/logger/winston/transaporter"));
const asterisk = '***';
class WinstonLogger {
    constructor() {
        this.attributesRedaction = (response) => {
            const data = (0, lodash_1.cloneDeep)(response);
            if (data?.headers?.authorization)
                data.headers.authorization = asterisk;
            return data;
        };
        this.getDataContext = (res) => {
            return {
                requestId: res.locals.requestId,
                requestDate: res.locals.requestDate,
            };
        };
        this.warn = (message, data) => {
            transaporter_1.default.warn(message, { dataContext: flatted_1.default.stringify(data) });
        };
        this.error = (message, data) => {
            transaporter_1.default.error(message, { dataContext: flatted_1.default.stringify(data) });
        };
        this.verbose = (message, data) => {
            transaporter_1.default.verbose(message, { dataContext: flatted_1.default.stringify(data) });
        };
        this.debug = (data) => {
            transaporter_1.default.info(data);
        };
        this.silly = (message, data) => {
            transaporter_1.default.silly(message, { dataContext: flatted_1.default.stringify(data) });
        };
        this.infoWithContext = (res, message, data) => {
            const dataContext = this.getDataContext(res);
            const newDataContext = Object.assign(dataContext, data);
            transaporter_1.default.info(message, { dataContext: flatted_1.default.stringify(newDataContext) });
        };
        this.errorWithContext = (res, message, data) => {
            const dataContext = this.getDataContext(res);
            const newDataContext = Object.assign(dataContext, data);
            transaporter_1.default.error(message, { dataContext: flatted_1.default.stringify(newDataContext) });
        };
        this.warnWithContext = (res, message, data) => {
            const dataContext = this.getDataContext(res);
            const newDataContext = Object.assign(dataContext, data);
            transaporter_1.default.warn(message, { dataContext: flatted_1.default.stringify(newDataContext) });
        };
        this.verboseWithContext = (res, message, data) => {
            const dataContext = this.getDataContext(res);
            const newDataContext = Object.assign(dataContext, data);
            transaporter_1.default.verbose(message, { dataContext: flatted_1.default.stringify(newDataContext) });
        };
        this.debugWithContext = (res, message, data) => {
            const dataContext = this.getDataContext(res);
            const newDataContext = Object.assign(dataContext, data);
            transaporter_1.default.debug(message, { dataContext: flatted_1.default.stringify(newDataContext) });
        };
        this.sillyWithContext = (res, message, data) => {
            const dataContext = this.getDataContext(res);
            const newDataContext = Object.assign(dataContext, data);
            transaporter_1.default.silly(message, { dataContext: flatted_1.default.stringify(newDataContext) });
        };
        this.startProfile = (res, name, data) => {
            const dataContext = this.getDataContext(res);
            const newDataContext = Object.assign(dataContext, data);
            transaporter_1.default.profile(name, {
                level: 'debug',
                message: flatted_1.default.stringify({ dataContext: newDataContext }),
            });
        };
        this.endProfile = (res, name, data) => {
            const dataContext = this.getDataContext(res);
            const newDataContext = Object.assign(dataContext, data);
            transaporter_1.default.profile(name, {
                level: 'debug',
                message: flatted_1.default.stringify({ dataContext: newDataContext }),
            });
        };
        this.originalError = (res, message, data) => {
            const dataContext = this.getDataContext(res);
            const newDataContext = Object.assign(dataContext, {
                message: data.errors.message,
                stack: data.errors.stack,
            });
            transaporter_1.default.error(message, { dataContext: flatted_1.default.stringify(newDataContext) });
        };
        this.startRequest = (data) => {
            transaporter_1.default.info('START_REQUEST', this.attributesRedaction(data));
        };
        this.startRequestGrpc = (data) => {
            transaporter_1.default.info('START_REQUEST', data);
        };
        this.profiling = (res, user) => {
            transaporter_1.default.info('PROFILING', {
                requestId: res.locals.requestId,
                user,
            });
        };
        this.errorException = (res, data) => {
            transaporter_1.default.error('ERROR_EXCEPTION', {
                requestId: res?.locals?.requestId ?? 'unknown',
                ...data,
                originalError: data.originalError
                    ? data.originalError.toString()
                    : null,
                stack: data.originalError?.stack ?? null,
            });
        };
        this.rawResponse = (res, data) => {
            transaporter_1.default.info('RAW_RESPONSE', {
                requestId: res.locals.requestId,
                rawResponse: data,
            });
        };
        this.axiosResponse = (data, requestId, message = 'MODULE_RESPONSE') => {
            transaporter_1.default.info(message, {
                requestId,
                formattedRequest: {
                    headers: data.config.headers,
                    endpoint: data.config.url,
                    method: data.config.method,
                },
                formattedResponse: {
                    code: data.status,
                    data: data.data,
                },
            });
        };
        this.midtransGetStatusResponse = (data, requestId, message = 'MODULE_RESPONSE') => {
            transaporter_1.default.info(message, {
                requestId,
                formattedRequest: {
                    headers: null,
                    endpoint: null,
                    method: null,
                },
                formattedResponse: {
                    code: 200,
                    data,
                },
            });
        };
        this.axiosErrorResponse = (data, requestId, message = 'MODULE_RESPONSE') => {
            transaporter_1.default.info(message, {
                requestId,
                axiosResponse: flatted_1.default.stringify(data),
                formattedResponse: {
                    code: data.status || 400,
                    data: data.data,
                },
            });
        };
        this.emailErrorResponse = (data, requestId, message = 'MODULE_RESPONSE') => {
            transaporter_1.default.info(message, {
                requestId,
                axiosResponse: flatted_1.default.stringify(data),
                formattedResponse: {
                    code: 400,
                    data,
                },
            });
        };
        this.info = (data, requestId, message = '') => {
            transaporter_1.default.info(message, {
                requestId,
                data,
            });
        };
    }
    endRequest(data) {
        transaporter_1.default.info(`END_REQUEST`, data);
    }
}
exports.WinstonLogger = WinstonLogger;
