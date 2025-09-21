"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const usecases_1 = require("../../../../modules/user/usecases");
const errors_1 = require("../../../../shared/errors");
const base_transaction_1 = require("../../../../infrastructure/database/mongodb/base.transaction");
jest.mock('@app/infrastructure/database/mongodb/base.transaction');
function createMockUser() {
    return {
        _id: 'mock-id',
        username: 'john_doe',
        email: 'john@example.com',
        password: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date(),
    };
}
describe('DeleteUserUseCase', () => {
    let useCase;
    let userRepo;
    beforeEach(() => {
        userRepo = {
            findById: jest.fn(),
            findByIdAndDelete: jest.fn(),
        };
        useCase = new usecases_1.DeleteUserUseCase(userRepo);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should delete user successfully inside transaction', async () => {
        const dto = { id: 'mock-id' };
        const mockUser = createMockUser();
        userRepo.findById.mockResolvedValue(mockUser);
        base_transaction_1.runInTransaction.mockImplementation(async (cb) => {
            return cb('mockSession');
        });
        userRepo.findByIdAndDelete.mockResolvedValue(mockUser);
        const result = await useCase.execute(dto);
        expect(userRepo.findById).toHaveBeenCalledWith(dto.id);
        expect(base_transaction_1.runInTransaction).toHaveBeenCalledTimes(1);
        expect(userRepo.findByIdAndDelete).toHaveBeenCalledWith(dto.id, { session: 'mockSession' });
        expect(result).toEqual(mockUser);
    });
    it('should throw ResourceNotFoundError if user not found', async () => {
        const dto = { id: 'non-existent-id' };
        userRepo.findById.mockResolvedValue(null);
        await expect(useCase.execute(dto)).rejects.toThrow(errors_1.InternalError.ResourceNotFoundError);
        expect(userRepo.findById).toHaveBeenCalledWith(dto.id);
        expect(base_transaction_1.runInTransaction).not.toHaveBeenCalled();
    });
});
