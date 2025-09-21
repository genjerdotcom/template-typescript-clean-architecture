import { Request, Response } from 'express';
import { HttpResponse } from '@app/shared/responses';
import { GetUserDto } from '@app/modules/user/dtos';
import { GetUserUseCase } from '@app/modules/user/usecases';
import { injectable, inject } from 'tsyringe';
import { UserTransformer } from '@app/modules/user/transformers/user.transform';
import { plainToClass } from 'class-transformer';

@injectable()
export class UserGetController {
    constructor(
        @inject('GetUserUseCase') private readonly getUserUseCase: GetUserUseCase
    ) {}

    async handle(req: Request, res: Response) {
        const data = plainToClass(GetUserDto, { ...req.query});
        const result = await this.getUserUseCase.execute(data);
        const transform = UserTransformer.transformManyPaginate(result);
        return HttpResponse.pagination(res, 'success', transform.data, transform.recordsTotal);
    }
}
