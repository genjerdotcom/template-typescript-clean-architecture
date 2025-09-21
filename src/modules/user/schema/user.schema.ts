import { CreateModel, Documents } from '@app/infrastructure/database';
import { User } from '@app/modules/user/domain/user.entity';

export const UserModel = CreateModel<User & Documents>(
    'user',
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true },
    [
        {
            fields: { email: 1, username: 1 },
            options: { unique: true, name: 'email_username_unique' },
        },
    ]
);