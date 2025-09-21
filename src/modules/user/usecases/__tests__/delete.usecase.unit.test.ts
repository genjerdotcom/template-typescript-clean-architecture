import 'reflect-metadata';
import { DeleteUserUseCase } from '@app/modules/user/usecases';
import { UserRepository } from '@app/modules/user/repositories/user.repository';
import { DeleteUserDto } from '@app/modules/user/dtos';
import { InternalError } from '@app/shared/errors';
import { runInTransaction } from '@app/infrastructure/database/mongodb/base.transaction';
import { User } from '@app/modules/user/domain/user.entity';
import { Documents } from '@app/infrastructure/database';

jest.mock('@app/infrastructure/database/mongodb/base.transaction');

function createMockUser(): User & Documents {
    return {
        _id: 'mock-id',
        username: 'john_doe',
        email: 'john@example.com',
        password: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date(),
    } as User & Documents;
}

describe('DeleteUserUseCase', () => {
    let useCase: DeleteUserUseCase;
    let userRepo: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepo = {
            findById: jest.fn(),
            findByIdAndDelete: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        useCase = new DeleteUserUseCase(userRepo);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete user successfully inside transaction', async () => {
        const dto: DeleteUserDto = { id: 'mock-id' };
        const mockUser = createMockUser();

        userRepo.findById.mockResolvedValue(mockUser);
        (runInTransaction as jest.Mock).mockImplementation(async (cb) => {
            return cb('mockSession');
        });

        userRepo.findByIdAndDelete.mockResolvedValue(mockUser);

        const result = await useCase.execute(dto);

        expect(userRepo.findById).toHaveBeenCalledWith(dto.id);
        expect(runInTransaction).toHaveBeenCalledTimes(1);
        expect(userRepo.findByIdAndDelete).toHaveBeenCalledWith(dto.id, { session: 'mockSession' });
        expect(result).toEqual(mockUser);
    });

    it('should throw ResourceNotFoundError if user not found', async () => {
        const dto: DeleteUserDto = { id: 'non-existent-id' };
        userRepo.findById.mockResolvedValue(null);

        await expect(useCase.execute(dto)).rejects.toThrow(InternalError.ResourceNotFoundError);
        expect(userRepo.findById).toHaveBeenCalledWith(dto.id);
        expect(runInTransaction).not.toHaveBeenCalled();
    });
});
