import { Request, Response } from 'express';
import { HttpResponse } from '@app/shared/responses';
import { DetailUserDto } from '@app/modules/user/dtos';
import { DetailUserUseCase } from '@app/modules/user/usecases';
import { injectable, inject } from 'tsyringe';
import { UserTransformer } from '@app/modules/user/transformers/user.transform';
import { plainToClass } from 'class-transformer';

@injectable()
export class UserDetailController {
    constructor(
        @inject('DetailUserUseCase') private readonly detailUserUseCase: DetailUserUseCase
    ) {}

    async handle(req: Request, res: Response) {
        const data = plainToClass(DetailUserDto, { ...req.params, ...req.query });
        const result = await this.detailUserUseCase.execute(data);
        const transform = UserTransformer.transform(result);
        return HttpResponse.success(res, 'success', transform);
    }
}
