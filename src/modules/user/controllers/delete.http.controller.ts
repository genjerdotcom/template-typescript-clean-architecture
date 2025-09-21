import { Request, Response } from 'express';
import { HttpResponse } from '@app/shared/responses';
import { DeleteUserDto } from '@app/modules/user/dtos';
import { DeleteUserUseCase } from '@app/modules/user/usecases';
import { injectable, inject } from 'tsyringe';
import { UserTransformer } from '@app/modules/user/transformers/user.transform';
import { plainToClass } from 'class-transformer';

@injectable()
export class UserDeleteController {
    constructor(
        @inject('DeleteUserUseCase') private readonly deleteUserUseCase: DeleteUserUseCase
    ) {}

    async handle(req: Request, res: Response) {
        const data = plainToClass(DeleteUserDto, { ...req.params, ...req.body });
        const result = await this.deleteUserUseCase.execute(data);
        const transform = UserTransformer.transform(result);
        return HttpResponse.success(res, 'success', transform);
    }
}
