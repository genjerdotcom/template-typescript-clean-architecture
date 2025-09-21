import { Request, Response } from 'express';
import { HttpResponse } from '@app/shared/responses';
import { CreateUserDto } from '@app/modules/user/dtos';
import { CreateUserUseCase } from '@app/modules/user/usecases';
import { injectable, inject } from 'tsyringe';
import { plainToClass } from 'class-transformer';

@injectable()
export class UserCreateController {
    constructor(
        @inject('CreateUserUseCase') private readonly createUserUseCase: CreateUserUseCase
    ) {}

    async handle(req: Request, res: Response) {
        const data = plainToClass(CreateUserDto, { ...req.body});
        const result = await this.createUserUseCase.execute(data);
        return HttpResponse.created(res, 'success', result);
    }
}
