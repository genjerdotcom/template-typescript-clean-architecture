import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '@app/presentation/http/responses';

export default function validateRequest<T extends object>(DtoClass: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const merged = {
            ...req.params,
            ...req.query,
            ...req.body,
        };

        const dtoObject = plainToInstance(DtoClass, merged);
        const errors = await validate(dtoObject, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
            const errorResults = errors.map(({ property, constraints }) => ({
                property,
                constraints,
            }));
            return HttpResponse.badRequest(res, { errors: errorResults });
        }

        next();
    };
}