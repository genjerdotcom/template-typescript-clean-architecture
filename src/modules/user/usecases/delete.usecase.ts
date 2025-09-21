import { injectable, inject } from 'tsyringe';
import { DeleteUserDto } from '@app/modules/user/dtos';
import { UserRepository } from '@app/modules/user/repositories/user.repository';
import { User } from '@app/modules/user/domain/user.entity';
import { InternalError } from '@app/shared/errors';
import { runInTransaction } from '@app/infrastructure/database/mongodb/base.transaction';

@injectable()
export class DeleteUserUseCase {
    constructor(
        @inject('UserRepository') private readonly userRepo: UserRepository
    ) {}

    async execute(dto: DeleteUserDto): Promise<User> {
        const user = await this.userRepo.findById(dto.id);
        if (!user) throw new InternalError.ResourceNotFoundError('user', dto.id);

        await runInTransaction(async (session) => {
            await this.userRepo.findByIdAndDelete(dto.id, { session });
        });
        
        return user;
    }
}
