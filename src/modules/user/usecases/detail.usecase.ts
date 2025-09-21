import { injectable, inject } from 'tsyringe';
import { DetailUserDto } from '@app/modules/user/dtos';
import { UserRepository } from '@app/modules/user/repositories/user.repository';
import { User } from '@app/modules/user/domain/user.entity';
import { InternalError } from '@app/shared/errors';

@injectable()
export class DetailUserUseCase {
    constructor(
        @inject('UserRepository') private readonly userRepo: UserRepository
    ) {}

    async execute(dto: DetailUserDto): Promise<User> {
        const user = await this.userRepo.findById(dto.id);
        if (!user) throw new InternalError.ResourceNotFoundError('user', dto.id); 
        return user;
    }
}
