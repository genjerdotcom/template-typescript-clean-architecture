import { BaseRepository, Models, Documents } from '@app/infrastructure/database';
import { User } from '@app/modules/user/domain/user.entity';
import { injectable } from 'tsyringe';

@injectable()
export class UserRepository extends BaseRepository<User & Documents> {
    constructor(model: Models<User & Documents>) {
        super(model);
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.model.findOne({ username }).exec();
    }
}
