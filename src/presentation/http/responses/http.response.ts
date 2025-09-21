import { Response } from "express"
import ResponseFormat from "@app/shared/responses/format.response";
import { HTTP_CODE, INTERNAL_CODE } from "@app/shared/constants/code";
import { AppError } from "@app/shared/types";

class HttpResponse {
    static success <T>(
        res: Response,
        message: string,
        data?: T
    ) {
        const response = ResponseFormat.success(
            INTERNAL_CODE.SUCCESS.OK.code,
            INTERNAL_CODE.SUCCESS.OK.status,
            message,
            data,
        );

        res.status(HTTP_CODE.SUCCESS.OK.code).send(response);
    }

    static pagination <T>(
        res: Response,
        message: string,
        data: T,
        recordsTotal: number
    ) {
        const response = ResponseFormat.pagination(
            INTERNAL_CODE.SUCCESS.OK.code,
            INTERNAL_CODE.SUCCESS.OK.status,
            message,
            recordsTotal,
            data
        );

        res.status(HTTP_CODE.SUCCESS.OK.code).send(response);
    }

    static downloadStream (
        res: Response,
        filename: string
    ) {

        res.status(HTTP_CODE.SUCCESS.OK.code).set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename=${filename}`,
        })
    }

    static created <T>(
        res: Response, 
        message: string, 
        data: T
    ) {
        res.status(HTTP_CODE.SUCCESS.CREATED.code).send(
            ResponseFormat.success(
                INTERNAL_CODE.SUCCESS.CREATED.code,
                INTERNAL_CODE.SUCCESS.CREATED.status,
                message,
                data,
            ),
        );
    }

    static notFound <T extends { errors: AppError | AppError[] }>(
        res: Response, 
        errors: T
    ) {
        res.status(HTTP_CODE.CLIENT_ERROR.NOT_FOUND.code).send(
            ResponseFormat.error(errors),
        );
    }

    static badRequest <T extends { errors: AppError | AppError[] }>(
        res: Response, 
        errors: T
    ) {
        res.status(HTTP_CODE.CLIENT_ERROR.BAD_REQUEST.code).send(
            ResponseFormat.error(errors),
        );
    }

    static unauthorized <T extends { errors: AppError | AppError[] }>(
        res: Response, 
        errors: T
    ) {
        res.status(HTTP_CODE.CLIENT_ERROR.UNAUTHORIZED.code).send(
            ResponseFormat.error(errors),
        );
    }

    static forbidden <T extends { errors: AppError | AppError[] }>(
        res: Response, 
        errors: T
    ) {
        res.status(HTTP_CODE.CLIENT_ERROR.FORBIDDEN.code).send(
            ResponseFormat.error(errors),
        );
    }

    static internalServerError <T extends { errors: AppError | AppError[] }>(
        res: Response, 
        errors: T
    ) {
        res.status(HTTP_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR.code).send(
            ResponseFormat.error(errors),
        );
    }

    static errorHandler <T extends { errors: AppError | AppError[] }>(
        res: Response,
        responseCode: number,
        errors: T,
    ) {
        switch (responseCode) {
            case HTTP_CODE.CLIENT_ERROR.NOT_FOUND.code: {
                this.notFound(res, errors);
                break;
            }
            case HTTP_CODE.CLIENT_ERROR.BAD_REQUEST.code: {
                this.badRequest(res, errors);
                break;
            }
            case HTTP_CODE.CLIENT_ERROR.UNAUTHORIZED.code: {
                this.unauthorized(res, errors);
                break;
            }
            case HTTP_CODE.CLIENT_ERROR.FORBIDDEN.code: {
                this.forbidden(res, errors);
                break;
            }
            case HTTP_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR.code: {
                this.internalServerError(res, errors);
                break;
            }
            default: {
                this.internalServerError(res, errors);
                break;
            }
        }
    }
}

export default HttpResponse;