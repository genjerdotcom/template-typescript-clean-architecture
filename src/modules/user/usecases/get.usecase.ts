import { injectable, inject } from 'tsyringe';
import { GetUserDto } from '@app/modules/user/dtos';
import { UserRepository } from '@app/modules/user/repositories/user.repository';
import { User } from '@app/modules/user/domain/user.entity';
import { PaginatedResult } from '@app/shared/types';

@injectable()
export class GetUserUseCase {
    constructor(
        @inject('UserRepository') private readonly userRepo: UserRepository
    ) {}
    async execute(dto: GetUserDto): Promise<PaginatedResult<User>> {
        return this.userRepo.aggregatePaginated(dto);
    }
}
