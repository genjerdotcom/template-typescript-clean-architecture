import 'reflect-metadata';
import { DetailUserUseCase } from '@app/modules/user/usecases';
import { UserRepository } from '@app/modules/user/repositories/user.repository';
import { DetailUserDto } from '@app/modules/user/dtos';
import { InternalError } from '@app/shared/errors';
import { User } from '@app/modules/user/domain/user.entity';
import { Documents } from '@app/infrastructure/database';

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

describe('DetailUserUseCase', () => {
    let useCase: DetailUserUseCase;
    let userRepo: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepo = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        useCase = new DetailUserUseCase(userRepo);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user detail if user exists', async () => {
        const dto: DetailUserDto = { id: 'mock-id' };
        const mockUser = createMockUser();

        userRepo.findById.mockResolvedValue(mockUser);

        const result = await useCase.execute(dto);

        expect(userRepo.findById).toHaveBeenCalledWith(dto.id);
        expect(result).toEqual(mockUser);
    });

    it('should throw ResourceNotFoundError if user does not exist', async () => {
        const dto: DetailUserDto = { id: 'not-found' };
        userRepo.findById.mockResolvedValue(null);

        await expect(useCase.execute(dto)).rejects.toThrow(InternalError.ResourceNotFoundError);
        expect(userRepo.findById).toHaveBeenCalledWith(dto.id);
    });
});
