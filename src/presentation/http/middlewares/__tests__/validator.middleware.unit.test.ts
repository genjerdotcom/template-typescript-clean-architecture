import validateRequest from '@app/presentation/http/middlewares/validator.middleware';
import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpResponse } from '@app/presentation/http/responses';

jest.mock('class-transformer', () => ({
    plainToInstance: jest.fn(),
}));

jest.mock('class-validator', () => ({
    validate: jest.fn(),
}));

jest.mock('@app/presentation/http/responses', () => ({
    HttpResponse: {
        badRequest: jest.fn(),
    },
}));

class DummyDto {
    name!: string;
    age!: number;
}

describe('validateRequest middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            params: {},
            query: {},
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();

        (plainToInstance as jest.Mock).mockClear();
        (validate as jest.Mock).mockClear();
        (HttpResponse.badRequest as jest.Mock).mockClear();
    });

    it('should call next if validation passes', async () => {
        (plainToInstance as jest.Mock).mockReturnValue(new DummyDto());
        (validate as jest.Mock).mockResolvedValue([]);

        const middleware = validateRequest(DummyDto);
        await middleware(req as Request, res as Response, next);

        expect(plainToInstance).toHaveBeenCalled();
        expect(validate).toHaveBeenCalled();
        expect(HttpResponse.badRequest).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
        const mockErrors = [
        {
            property: 'name',
            constraints: { isString: 'name must be a string' },
        },
        {
            property: 'age',
            constraints: { isNumber: 'age must be a number' },
        },
        ];

        (plainToInstance as jest.Mock).mockReturnValue(new DummyDto());
        (validate as jest.Mock).mockResolvedValue(mockErrors);

        const middleware = validateRequest(DummyDto);
        await middleware(req as Request, res as Response, next);

        expect(plainToInstance).toHaveBeenCalled();
        expect(validate).toHaveBeenCalled();
        expect(HttpResponse.badRequest).toHaveBeenCalledWith(res, {
        errors: [
            {
                property: 'name',
                constraints: { isString: 'name must be a string' },
            },
            {
                property: 'age',
                constraints: { isNumber: 'age must be a number' },
            },
        ],
        });
        expect(next).not.toHaveBeenCalled();
    });
});
