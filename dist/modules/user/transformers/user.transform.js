"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTransformer = void 0;
class UserTransformer {
    static transform(user) {
        if (!user)
            return null;
        return {
            id: user._id,
            username: user.username,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
    static transformMany(users) {
        return users.map((user) => this.transform(user));
    }
    static transformManyPaginate(data) {
        return {
            data: this.transformMany(data.results),
            recordsTotal: data.count
        };
    }
}
exports.UserTransformer = UserTransformer;
