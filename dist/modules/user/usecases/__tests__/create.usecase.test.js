"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const usecases_1 = require("../../../../modules/user/usecases");
const base_transaction_1 = require("../../../../infrastructure/database/mongodb/base.transaction");
jest.mock('@app/infrastructure/database/mongodb/base.transaction');
function createMockUser() {
    const mockUser = {
        _id: 'mock-id',
        username: 'john_doe',
        email: 'john@example.com',
        password: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date(),
    };
    return mockUser;
}
describe('CreateUserUseCase', () => {
    let useCase;
    let userRepo;
    beforeEach(() => {
        userRepo = {
            create: jest.fn()
        };
        useCase = new usecases_1.CreateUserUseCase(userRepo);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should create user successfully inside transaction', async () => {
        const dto = {
            username: 'john_doe',
            email: 'john@example.com',
            password: 'plain_password'
        };
        const mockUser = createMockUser();
        base_transaction_1.runInTransaction.mockImplementation(async (cb) => {
            return cb('mockSession');
        });
        userRepo.create.mockResolvedValue(mockUser);
        const result = await useCase.execute(dto);
        expect(base_transaction_1.runInTransaction).toHaveBeenCalledTimes(1);
        expect(userRepo.create).toHaveBeenCalledWith({
            username: dto.username,
            email: dto.email,
            password: dto.password
        }, 'mockSession');
        expect(result).toEqual(mockUser);
    });
});
