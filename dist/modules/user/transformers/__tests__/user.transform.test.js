"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_transform_1 = require("../../../../modules/user/transformers/user.transform");
// Mock data
const mockUser = {
    _id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-02'),
};
describe('UserTransformer', () => {
    describe('transform', () => {
        it('should return null if input is null', () => {
            const result = user_transform_1.UserTransformer.transform(null);
            expect(result).toBeNull();
        });
        it('should transform a single User correctly', () => {
            const result = user_transform_1.UserTransformer.transform(mockUser);
            expect(result).toEqual({
                id: mockUser._id,
                username: mockUser.username,
                email: mockUser.email,
                created_at: mockUser.created_at,
                updated_at: mockUser.updated_at,
            });
        });
    });
    describe('transformMany', () => {
        it('should transform an array of users correctly', () => {
            const result = user_transform_1.UserTransformer.transformMany([mockUser]);
            expect(result).toEqual([
                {
                    id: mockUser._id,
                    username: mockUser.username,
                    email: mockUser.email,
                    created_at: mockUser.created_at,
                    updated_at: mockUser.updated_at,
                },
            ]);
        });
        it('should return empty array when input is empty', () => {
            const result = user_transform_1.UserTransformer.transformMany([]);
            expect(result).toEqual([]);
        });
    });
    describe('transformManyPaginate', () => {
        it('should transform paginated result correctly', () => {
            const result = user_transform_1.UserTransformer.transformManyPaginate({
                results: [mockUser],
                count: 1,
            });
            expect(result).toEqual({
                data: [
                    {
                        id: mockUser._id,
                        username: mockUser.username,
                        email: mockUser.email,
                        created_at: mockUser.created_at,
                        updated_at: mockUser.updated_at,
                    },
                ],
                recordsTotal: 1,
            });
        });
        it('should return empty data array if results is empty', () => {
            const result = user_transform_1.UserTransformer.transformManyPaginate({
                results: [],
                count: 0,
            });
            expect(result).toEqual({
                data: [],
                recordsTotal: 0,
            });
        });
    });
});
