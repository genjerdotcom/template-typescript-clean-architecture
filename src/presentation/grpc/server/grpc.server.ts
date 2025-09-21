import { Server, ServerCredentials } from '@grpc/grpc-js';
import { registerGrpcHandlers } from '@app/presentation/grpc/handler/grpc.handler';
import { logger } from '@app/infrastructure/logger';

export function startGrpcServer(): void  {
    const server = new Server();

    registerGrpcHandlers(server);

    const PORT = process.env.GRPC_PORT ?? '50051';
    const ADDRESS = `${process.env.GRPC_HOST}:${PORT}`;

    server.bindAsync(ADDRESS, ServerCredentials.createInsecure(), (error) => {
        if (error) {
            logger.error('Failed to start gRPC server:', error);
            return;
        }
        logger.info(`gRPC server is running at ${ADDRESS}`, 'GRPC', 'GRPC_SERVER');
    });
}
