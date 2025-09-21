import { ILogger } from "@app/infrastructure/logger/ILogger";
import flatted from "flatted";
import { cloneDeep } from "lodash";
import logger from "@app/infrastructure/logger/winston/transaporter";
import { ResponseWithHeaders, ErrorData, ResponseContext } from "@app/shared/types";
import { AxiosResponse } from 'axios';

const asterisk = '***';

export class WinstonLogger implements ILogger {
    private readonly attributesRedaction = (response: ResponseWithHeaders): ResponseWithHeaders => {
        const data = cloneDeep(response);
        if (data?.headers?.authorization) data.headers.authorization = asterisk;
        return data;
    }

    private readonly getDataContext = (res: ResponseContext) => {
        return {
            requestId: res.locals.requestId,
            requestDate: res.locals.requestDate,
        }
    }

    warn = <T extends object>(message: string, data: T): void => {
        logger.warn(message, { dataContext: flatted.stringify(data) });
    };

    error = <T = unknown>(message: string, data: T): void => {
        logger.error(message, { dataContext: flatted.stringify(data) });
    };
    
    verbose = <T extends object>(message: string, data: T): void => {
        logger.verbose(message, { dataContext: flatted.stringify(data) });
    };
    
    debug = <T extends object>(data: T): void => {
        logger.info(data);
    };
    
    silly = <T extends object>(message: string, data: T): void => {
        logger.silly(message, { dataContext: flatted.stringify(data) });
    };
    
    infoWithContext = <T extends object>(res: ResponseContext, message: string, data: T): void => {
        const dataContext = this.getDataContext(res);
        const newDataContext = Object.assign(dataContext, data);
        logger.info(message, { dataContext: flatted.stringify(newDataContext) });
    };
    
    errorWithContext = <T extends object>(res: ResponseContext, message: string, data: T): void => {
        const dataContext = this.getDataContext(res);
        const newDataContext = Object.assign(dataContext, data);
        logger.error(message, { dataContext: flatted.stringify(newDataContext) });
    };
    
    warnWithContext = <T extends object>(res: ResponseContext, message: string, data: T): void => {
        const dataContext = this.getDataContext(res);
        const newDataContext = Object.assign(dataContext, data);
        logger.warn(message, { dataContext: flatted.stringify(newDataContext) });
    };

    verboseWithContext = <T extends object>( res: ResponseContext, message: string, data: T): void => {
        const dataContext = this.getDataContext(res);
        const newDataContext = Object.assign(dataContext, data);
        logger.verbose(message, { dataContext: flatted.stringify(newDataContext) });
    };
    
    debugWithContext = <T extends object>(res: ResponseContext, message: string, data: T): void => {
        const dataContext = this.getDataContext(res);
        const newDataContext = Object.assign(dataContext, data);
        logger.debug(message, { dataContext: flatted.stringify(newDataContext) });
    };
    
    sillyWithContext = <T extends object>(res: ResponseContext, message: string, data: T): void => {
        const dataContext = this.getDataContext(res);
        const newDataContext = Object.assign(dataContext, data);
        logger.silly(message, { dataContext: flatted.stringify(newDataContext) });
    };
    
    startProfile = <T extends object>(res: ResponseContext, name: string, data: T): void => {
        const dataContext = this.getDataContext(res);
        const newDataContext = Object.assign(dataContext, data);
        logger.profile(name, {
            level: 'debug',
            message: flatted.stringify({ dataContext: newDataContext }),
        });
    };
    
    endProfile = <T extends object>(res: ResponseContext, name: string, data: T): void => {
        const dataContext = this.getDataContext(res);
        const newDataContext = Object.assign(dataContext, data);
        logger.profile(name, {
            level: 'debug',
            message: flatted.stringify({ dataContext: newDataContext }),
        });
    };
    
    originalError = (res: ResponseContext, message: string, data: ErrorData): void => {
        const dataContext = this.getDataContext(res);
        const newDataContext = Object.assign(dataContext, {
            message: data.errors.message,
            stack: data.errors.stack,
        });
        logger.error(message, { dataContext: flatted.stringify(newDataContext) });
    };
    
    startRequest = (data: ResponseWithHeaders): void => {
        logger.info('START_REQUEST', this.attributesRedaction(data));
    };

    startRequestGrpc = (data: ResponseWithHeaders): void => {
        logger.info('START_REQUEST', data);
    };

    endRequest<T>(data: T ): void {
        logger.info(`END_REQUEST`, data);
    }
    
    profiling = <T extends object>(res: ResponseContext, user: T): void => {
        logger.info('PROFILING', {
            requestId: res.locals.requestId,
            user,
        });
    };
    
    errorException = <T extends { originalError?: Error }>(
        res: ResponseContext,
        data: T
    ): void => {
        logger.error('ERROR_EXCEPTION', {
            requestId: res?.locals?.requestId ?? 'unknown',
            ...data,
            originalError: data.originalError
                ? data.originalError.toString()
                : null,
            stack: data.originalError?.stack ?? null,
        });
    };
    
    rawResponse = <T extends object>(res: ResponseContext, data: T): void => {
        logger.info('RAW_RESPONSE', {
            requestId: res.locals.requestId,
            rawResponse: data,
        });
    };

    axiosResponse = (
        data: AxiosResponse,
        requestId: string,
        message = 'MODULE_RESPONSE',
    ): void => {
        logger.info(message, {
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

    midtransGetStatusResponse = <T extends object>(
        data: T,
        requestId: string,
        message = 'MODULE_RESPONSE',
    ): void => {
        logger.info(message, {
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

    axiosErrorResponse = (
        data: AxiosResponse,
        requestId: string,
        message = 'MODULE_RESPONSE',
    ): void => {
        logger.info(message, {
            requestId,
            axiosResponse: flatted.stringify(data),
            formattedResponse: {
                code: data.status || 400,
                data: data.data,
            },
        });
    };

    emailErrorResponse = <T extends object>(
        data: T,
        requestId: string,
        message = 'MODULE_RESPONSE',
    ): void => {
        logger.info(message, {
            requestId,
            axiosResponse: flatted.stringify(data),
            formattedResponse: {
                code: 400,
                data,
            },
        });
    };
    
    info = <T extends object | string>(data: T, requestId?: string, message = ''): void => {
        logger.info(message, {
            requestId,
            data,
        });
    };
}

