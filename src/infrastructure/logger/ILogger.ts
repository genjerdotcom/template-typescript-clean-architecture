import { ErrorData, ResponseWithHeaders, ResponseContext } from "@app/shared/types";
import { AxiosResponse } from 'axios';

export interface ILogger {
    warn<T extends object>(message: string, data: T): void;
    error<T extends object>(message: string, data: T): void;
    verbose<T extends object>(message: string, data: T): void;
    debug<T extends object>(data: T): void;
    silly<T extends object>(message: string, data: T): void
    infoWithContext<T extends object>(res: ResponseContext, message: string, data: T): void;
    errorWithContext<T extends object>(res: ResponseContext, message: string, data: T): void;
    warnWithContext<T extends object>(res: ResponseContext, message: string, data: T): void;
    verboseWithContext<T extends object>(res: ResponseContext, message: string, data: T): void;
    debugWithContext<T extends object>(res: ResponseContext, message: string, data: T): void;
    sillyWithContext<T extends object>(res: ResponseContext, message: string, data: T): void;
    startProfile<T extends object>(res: ResponseContext, name: string, data: T): void;
    endProfile<T extends object>(res: ResponseContext, name: string, data: T): void;
    originalError (res: ResponseContext, message: string, data: ErrorData): void;
    startRequest (data: ResponseWithHeaders): void;
    profiling<T extends object>(res: ResponseContext, user: T): void;
    errorException<T extends { originalError?: Error }>(res: ResponseContext, data: T): void
    rawResponse<T extends object>(res: ResponseContext, data: T): void;
    axiosResponse(data: AxiosResponse, requestId: string, message: string): void;
    midtransGetStatusResponse<T extends object>(data: T, requestId: string, message: string): void;
    axiosErrorResponse(data: AxiosResponse,requestId: string, message: string): void;
    emailErrorResponse<T extends object>(data: T, requestId: string,message: string): void;
    info<T extends object>(data: T, requestId: string, message: string): void;
}

