import { status, sendUnaryData, ServiceError, Metadata } from '@grpc/grpc-js';
import ResponseFormat from '@app/shared/responses/format.response';
import { INTERNAL_CODE } from '@app/shared/constants/code';


export function success<T>(
  callback: sendUnaryData<T>,
  message: string,
  data?: T
): void {
  const response = {
    ...ResponseFormat.success(
      INTERNAL_CODE.SUCCESS.OK.code,
      INTERNAL_CODE.SUCCESS.OK.status,
      message,
      data
    ),
  } as T;

  callback(null, response);
}

export function created<T>(
    callback: sendUnaryData<T>,
    message: string,
    data: T | null
): void {
    const response = {
      ...ResponseFormat.success(
        INTERNAL_CODE.SUCCESS.CREATED.code,
        INTERNAL_CODE.SUCCESS.CREATED.status,
        message,
        data
      ),
    } as T;
    
    callback(null, response);
}

export function error<T>(
    callback: sendUnaryData<T>,
    code: status,
    message: string,
    details: unknown
): void {
    const metadata = new Metadata();
    metadata.set('error-code', code.toString());
    metadata.set('error-message', message);

    const error: ServiceError = {
        name: 'GrpcError',
        message,
        code,
        details: typeof details === 'string' ? details : JSON.stringify(details),
        metadata,
    };

    callback(error, null);
}

export function badRequest<T>(callback: sendUnaryData<T>, details: unknown): void {
    error(callback, status.INVALID_ARGUMENT, 'Bad Request', details);
}

export function notFound<T>(callback: sendUnaryData<T>, details: unknown): void {
    error(callback, status.NOT_FOUND, 'Not Found', details);
}

export function internalServerError<T>(callback: sendUnaryData<T>, details: unknown): void {
    error(callback, status.INTERNAL, 'Internal Server Error', details);
}

export function unauthorized<T>(callback: sendUnaryData<T>, details: unknown): void {
    error(callback, status.UNAUTHENTICATED, 'Unauthorized', details);
}

export function forbidden<T>(callback: sendUnaryData<T>, details: unknown): void {
    error(callback, status.PERMISSION_DENIED, 'Forbidden', details);
}
