import { Request, Response } from 'express';
import { HttpResponse } from '@app/shared/responses';
import { UpdateUserDto } from '@app/modules/user/dtos';
import { UpdateUserUseCase } from '@app/modules/user/usecases';
import { injectable, inject } from 'tsyringe';
import { plainToClass } from 'class-transformer';

@injectable()
export class UserUpdateController {
    constructor(
        @inject('UpdateUserUseCase') private readonly updateUserUseCase: UpdateUserUseCase
    ) {}

    async handle(req: Request, res: Response) {
        const data = plainToClass(UpdateUserDto, { ...req.body, ...req.params });
        const result = await this.updateUserUseCase.execute(data);
        return HttpResponse.created(res, 'success', result);
    }
}
