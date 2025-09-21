"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const usecases_1 = require("../../../../modules/user/usecases");
describe('GetUserUseCase', () => {
    let useCase;
    let userRepo;
    function createMockUser(id) {
        const mockUser = {
            _id: id,
            username: `user_${id}`,
            email: `${id}@example.com`,
            password: 'hashed_password',
            created_at: new Date(),
            updated_at: new Date()
        };
        return mockUser;
    }
    beforeEach(() => {
        userRepo = {
            aggregatePaginated: jest.fn()
        };
        useCase = new usecases_1.GetUserUseCase(userRepo);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return paginated list of users', async () => {
        const dto = {
            page: 1,
            size: 10,
            sortBy: 'created_at',
            descending: 'true'
        };
        const mockUsers = [createMockUser('1'), createMockUser('2')];
        const mockPaginatedResult = {
            results: mockUsers,
            count: 2
        };
        userRepo.aggregatePaginated.mockResolvedValue(mockPaginatedResult);
        const result = await useCase.execute(dto);
        expect(userRepo.aggregatePaginated).toHaveBeenCalledWith(dto);
        expect(result).toEqual(mockPaginatedResult);
    });
});
