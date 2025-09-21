import { User } from '@app/modules/user/domain/user.entity';
export class UserTransformer {
    static transform(user: User | null) {
        if (!user) return null;
        return {
            id: user._id,
            username: user.username,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }

    static transformMany(users: User[]) {
        return users.map((user) => this.transform(user));
    }

    static transformManyPaginate(data: { results: User[]; count: number }) {
        return {
            data: this.transformMany(data.results),
            recordsTotal: data.count
        };
    }
}