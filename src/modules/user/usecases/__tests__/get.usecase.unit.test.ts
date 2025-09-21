import 'reflect-metadata';
import { GetUserUseCase } from '@app/modules/user/usecases';
import { UserRepository } from '@app/modules/user/repositories/user.repository';
import { GetUserDto } from '@app/modules/user/dtos';
import { User } from '@app/modules/user/domain/user.entity';
import { PaginatedResult } from '@app/shared/types';
import { Documents } from '@app/infrastructure/database';

describe('GetUserUseCase', () => {
    let useCase: GetUserUseCase;
    let userRepo: jest.Mocked<UserRepository>;

    function createMockUser(id: string): User & Documents {
        const mockUser: Partial<User & Documents> = {
            _id: id,
            username: `user_${id}`,
            email: `${id}@example.com`,
            password: 'hashed_password',
            created_at: new Date(),
            updated_at: new Date()
        };
        return mockUser as User & Documents;
    }

    beforeEach(() => {
        userRepo = {
            aggregatePaginated: jest.fn()
        } as unknown as jest.Mocked<UserRepository>;

        useCase = new GetUserUseCase(userRepo);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return paginated list of users', async () => {
        const dto: GetUserDto = {
            page: 1,
            size: 10,
            sortBy: 'created_at',
            descending: 'true'
        };

        const mockUsers = [createMockUser('1'), createMockUser('2')];

        const mockPaginatedResult: PaginatedResult<User & Documents> = {
            results: mockUsers,
            count: 2
        };

        userRepo.aggregatePaginated.mockResolvedValue(mockPaginatedResult);

        const result = await useCase.execute(dto);

        expect(userRepo.aggregatePaginated).toHaveBeenCalledWith(dto);
        expect(result).toEqual(mockPaginatedResult);
    });
});
