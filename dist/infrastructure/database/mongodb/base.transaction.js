"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInTransaction = runInTransaction;
const mongoose_1 = __importDefault(require("mongoose"));
async function runInTransaction(operation) {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const result = await operation(session);
        await session.commitTransaction();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
}
