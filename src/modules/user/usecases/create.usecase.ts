import { injectable, inject } from 'tsyringe';
import { CreateUserDto } from '@app/modules/user/dtos';
import { UserRepository } from '@app/modules/user/repositories/user.repository';
import { User } from '@app/modules/user/domain/user.entity';
import { runInTransaction } from '@app/infrastructure/database/mongodb/base.transaction';

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject('UserRepository') private readonly userRepo: UserRepository
    ) {}
    async execute(dto: CreateUserDto): Promise<User> {
        const result = await runInTransaction(async (session) => {
            return this.userRepo.create({
                username: dto.username,
                email: dto.email,
                password: dto.password
            }, session);
        });

        return result;
    }
}
