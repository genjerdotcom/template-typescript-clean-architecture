"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const usecases_1 = require("../../../../modules/user/usecases");
const base_transaction_1 = require("../../../../infrastructure/database/mongodb/base.transaction");
const errors_1 = require("../../../../shared/errors");
jest.mock('@app/infrastructure/database/mongodb/base.transaction');
function createMockUser() {
    return {
        _id: 'mock-id',
        username: 'updated_username',
        email: 'updated@example.com',
        password: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date(),
    };
}
describe('UpdateUserUseCase', () => {
    let useCase;
    let userRepo;
    beforeEach(() => {
        userRepo = {
            findAndUpdate: jest.fn(),
            findById: jest.fn()
        };
        useCase = new usecases_1.UpdateUserUseCase(userRepo);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should update user and return updated user', async () => {
        const dto = {
            id: 'mock-id',
            username: 'updated_username',
            email: 'updated@example.com',
            password: ''
        };
        const mockUser = createMockUser();
        base_transaction_1.runInTransaction.mockImplementation(async (cb) => {
            return cb('mockSession');
        });
        userRepo.findById.mockResolvedValue(mockUser);
        const result = await useCase.execute(dto);
        expect(base_transaction_1.runInTransaction).toHaveBeenCalledTimes(1);
        expect(userRepo.findAndUpdate).toHaveBeenCalledWith({ _id: dto.id }, { $set: { username: dto.username, email: dto.email } }, { upsert: false }, false, 'mockSession');
        expect(userRepo.findById).toHaveBeenCalledWith(dto.id, 'mockSession');
        expect(result).toEqual(mockUser);
    });
    it('should throw ResourceNotFoundError if user not found', async () => {
        const dto = {
            id: 'mock-id',
            username: 'not_found',
            email: 'no@email.com',
            password: ''
        };
        base_transaction_1.runInTransaction.mockImplementation(async (cb) => {
            return cb('mockSession');
        });
        userRepo.findById.mockResolvedValue(null);
        await expect(useCase.execute(dto)).rejects.toThrow(errors_1.InternalError.ResourceNotFoundError);
        expect(userRepo.findAndUpdate).toHaveBeenCalled();
        expect(userRepo.findById).toHaveBeenCalled();
    });
});
