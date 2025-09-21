"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const usecases_1 = require("../../../../modules/user/usecases");
const errors_1 = require("../../../../shared/errors");
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
describe('DetailUserUseCase', () => {
    let useCase;
    let userRepo;
    beforeEach(() => {
        userRepo = {
            findById: jest.fn(),
        };
        useCase = new usecases_1.DetailUserUseCase(userRepo);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return user detail if user exists', async () => {
        const dto = { id: 'mock-id' };
        const mockUser = createMockUser();
        userRepo.findById.mockResolvedValue(mockUser);
        const result = await useCase.execute(dto);
        expect(userRepo.findById).toHaveBeenCalledWith(dto.id);
        expect(result).toEqual(mockUser);
    });
    it('should throw ResourceNotFoundError if user does not exist', async () => {
        const dto = { id: 'not-found' };
        userRepo.findById.mockResolvedValue(null);
        await expect(useCase.execute(dto)).rejects.toThrow(errors_1.InternalError.ResourceNotFoundError);
        expect(userRepo.findById).toHaveBeenCalledWith(dto.id);
    });
});
