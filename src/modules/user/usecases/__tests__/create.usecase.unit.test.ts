import 'reflect-metadata';
import { CreateUserUseCase } from '@app/modules/user/usecases';
import { UserRepository } from '@app/modules/user/repositories/user.repository';
import { CreateUserDto } from '@app/modules/user/dtos';
import { User } from '@app/modules/user/domain/user.entity';
import { runInTransaction } from '@app/infrastructure/database/mongodb/base.transaction';
import { Documents } from '@app/infrastructure/database';

jest.mock('@app/infrastructure/database/mongodb/base.transaction');

function createMockUser(): User & Documents {
    const mockUser: Partial<User & Documents> = {
        _id: 'mock-id',
        username: 'john_doe',
        email: 'john@example.com',
        password: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date(),
    };

    return mockUser as User & Documents;
}

describe('CreateUserUseCase', () => {
    let useCase: CreateUserUseCase;
    let userRepo: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepo = {
        create: jest.fn()
        } as unknown as jest.Mocked<UserRepository>;

        useCase = new CreateUserUseCase(userRepo);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create user successfully inside transaction', async () => {
        const dto: CreateUserDto = {
            username: 'john_doe',
            email: 'john@example.com',
            password: 'plain_password'
        };

        const mockUser = createMockUser();
        (runInTransaction as jest.Mock).mockImplementation(async (cb) => {
            return cb('mockSession');
        });

        userRepo.create.mockResolvedValue(mockUser);

        const result = await useCase.execute(dto);

        expect(runInTransaction).toHaveBeenCalledTimes(1);
        expect(userRepo.create).toHaveBeenCalledWith(
            {
                username: dto.username,
                email: dto.email,
                password: dto.password
            },
            'mockSession'
        );

        expect(result).toEqual(mockUser);
    });
});
