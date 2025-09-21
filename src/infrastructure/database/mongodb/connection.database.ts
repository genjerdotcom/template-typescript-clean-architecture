import mongoose, { ConnectOptions } from "mongoose";
import { logger } from "@app/infrastructure/logger";

export async function connectDatabase(): Promise<void> {
    const mongoUri = process.env.MONGODB_URL ?? '';
    const options: ConnectOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await mongoose.connect(mongoUri, options);
        logger.info('MongoDB connected successfully', 'MONGODB', 'MONGODB_CONNECTION');

        process.on('SIGINT', () => {
            mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit();
        });

    } catch (error: unknown) {
        logger.error('Failed to connect to MongoDB', error);
        mongoose.connection.close();
        process.exit(1);
    }
}
