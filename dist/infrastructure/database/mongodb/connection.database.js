"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../../../infrastructure/logger");
async function connectDatabase() {
    const mongoUri = process.env.MONGODB_URL ?? '';
    const options = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    try {
        await mongoose_1.default.connect(mongoUri, options);
        logger_1.logger.info('MongoDB connected successfully', 'MONGODB', 'MONGODB_CONNECTION');
        process.on('SIGINT', () => {
            mongoose_1.default.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit();
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to MongoDB', error);
        mongoose_1.default.connection.close();
        process.exit(1);
    }
}
