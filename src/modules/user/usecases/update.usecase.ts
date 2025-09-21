import { injectable, inject } from 'tsyringe';
import { UpdateUserDto } from '@app/modules/user/dtos';
import { UserRepository } from '@app/modules/user/repositories/user.repository';
import { User } from '@app/modules/user/domain/user.entity';
import { runInTransaction } from '@app/infrastructure/database/mongodb/base.transaction';
import { InternalError } from '@app/shared/errors';

@injectable()
export class UpdateUserUseCase {
    constructor(
        @inject('UserRepository') private readonly userRepo: UserRepository
    ) {}
    async execute(dto: UpdateUserDto): Promise<User> {
        const result = await runInTransaction(async (session) => {
            await this.userRepo.findAndUpdate(
                { _id: dto.id },
                { $set: { username: dto.username, email: dto.email } },
                { upsert: false },
                false,
                session
            );

            const updatedUser = await this.userRepo.findById(dto.id, session);
            if (!updatedUser) throw new InternalError.ResourceNotFoundError('user', dto.id);

            return updatedUser;
        });

        return result;
    }
}
