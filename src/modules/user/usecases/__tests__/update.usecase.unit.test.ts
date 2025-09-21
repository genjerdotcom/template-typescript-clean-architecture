import 'reflect-metadata';
import { UpdateUserUseCase } from '@app/modules/user/usecases';
import { UpdateUserDto } from '@app/modules/user/dtos';
import { UserRepository } from '@app/modules/user/repositories/user.repository';
import { runInTransaction } from '@app/infrastructure/database/mongodb/base.transaction';
import { InternalError } from '@app/shared/errors';
import { User } from '@app/modules/user/domain/user.entity';
import { Documents } from '@app/infrastructure/database';

jest.mock('@app/infrastructure/database/mongodb/base.transaction');

function createMockUser(): User & Documents {
    return {
        _id: 'mock-id',
        username: 'updated_username',
        email: 'updated@example.com',
        password: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date(),
    } as User & Documents;
}

describe('UpdateUserUseCase', () => {
    let useCase: UpdateUserUseCase;
    let userRepo: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepo = {
            findAndUpdate: jest.fn(),
            findById: jest.fn()
        } as unknown as jest.Mocked<UserRepository>;

        useCase = new UpdateUserUseCase(userRepo);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update user and return updated user', async () => {
        const dto: UpdateUserDto = {
            id: 'mock-id',
            username: 'updated_username',
            email: 'updated@example.com',
            password: ''
        };

        const mockUser = createMockUser();

        (runInTransaction as jest.Mock).mockImplementation(async (cb) => {
            return cb('mockSession');
        });

        userRepo.findById.mockResolvedValue(mockUser);

        const result = await useCase.execute(dto);

        expect(runInTransaction).toHaveBeenCalledTimes(1);
        expect(userRepo.findAndUpdate).toHaveBeenCalledWith(
            { _id: dto.id },
            { $set: { username: dto.username, email: dto.email } },
            { upsert: false },
            false,
            'mockSession'
        );
        expect(userRepo.findById).toHaveBeenCalledWith(dto.id, 'mockSession');
        expect(result).toEqual(mockUser);
    });

    it('should throw ResourceNotFoundError if user not found', async () => {
        const dto: UpdateUserDto = {
            id: 'mock-id',
            username: 'not_found',
            email: 'no@email.com',
            password: ''
        };

        (runInTransaction as jest.Mock).mockImplementation(async (cb) => {
            return cb('mockSession');
        });

        userRepo.findById.mockResolvedValue(null);

        await expect(useCase.execute(dto)).rejects.toThrow(InternalError.ResourceNotFoundError);
        expect(userRepo.findAndUpdate).toHaveBeenCalled();
        expect(userRepo.findById).toHaveBeenCalled();
    });
});
