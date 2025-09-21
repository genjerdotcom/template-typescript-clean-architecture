import { PaginationResponse, SuccessResponse, ErrorResponse, AppError } from "@app/shared/types";

class ResponseFormat {
    static success<T>(
        code: string,
        status: string,
        msg: string,
        data: T
    ): SuccessResponse<T> {
        return {
            meta: {
                code,
                status,
                message: msg,
            },
            data,
        };
    }

    static pagination<T>(
        code: string,
        status: string,
        msg: string,
        recordsTotal: number,
        data: T
    ): PaginationResponse<T> {
        return {
            meta: {
                code,
                status,
                message: msg,
            },
            recordsTotal,
            data,
        };
    }

    static error(errors: { errors: AppError[] | AppError }): ErrorResponse {
        return errors
    }
}

export default ResponseFormat;
