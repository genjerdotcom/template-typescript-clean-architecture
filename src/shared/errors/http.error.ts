import { HTTP_CODE } from "@app/shared/constants/code";

interface IAppError<T = unknown> {
    errors: T;
    status: number;
}

class AppError<T = unknown> extends Error implements IAppError<T> {
    public errors: T;
    public status: number;

    constructor(message: string, errors: T, status: number) {
        super(message);
        this.name = this.constructor.name;
        this.errors = errors;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}

class HttpError {
    static notFound<T>(errors: T) {
        return new AppError<T>(
            "Not Found",
            errors,
            HTTP_CODE.CLIENT_ERROR.NOT_FOUND.code
        );
    }

    static badRequest<T>(errors: T) {
        return new AppError<T>(
            "Bad Request",
            errors,
            HTTP_CODE.CLIENT_ERROR.BAD_REQUEST.code
        );
    }

    static unAuthorize<T>(errors: T) {
        return new AppError<T>(
            "Unauthorized",
            errors,
            HTTP_CODE.CLIENT_ERROR.UNAUTHORIZED.code
        );
    }

    static forbidden<T>(errors: T) {
        return new AppError<T>(
            "Forbidden",
            errors,
            HTTP_CODE.CLIENT_ERROR.FORBIDDEN.code
        );
    }

    static internalServerError<T>(errors: T) {
        return new AppError<T>(
            "Internal Server Error",
            errors,
            HTTP_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR.code
        );
    }

    static serviceRequestError<T>(errors: T, status = 400) {
        return new AppError<T>("Service Request Error", errors, status);
    }
}

export default HttpError;
export { AppError };
