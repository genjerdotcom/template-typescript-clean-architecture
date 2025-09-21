"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGrpcServer = startGrpcServer;
const grpc_js_1 = require("@grpc/grpc-js");
const grpc_handler_1 = require("../../../presentation/grpc/handler/grpc.handler");
const logger_1 = require("../../../infrastructure/logger");
function startGrpcServer() {
    const server = new grpc_js_1.Server();
    (0, grpc_handler_1.registerGrpcHandlers)(server);
    const PORT = process.env.GRPC_PORT ?? '50051';
    const ADDRESS = `${process.env.GRPC_HOST}:${PORT}`;
    server.bindAsync(ADDRESS, grpc_js_1.ServerCredentials.createInsecure(), (error) => {
        if (error) {
            logger_1.logger.error('Failed to start gRPC server:', error);
            return;
        }
        logger_1.logger.info(`gRPC server is running at ${ADDRESS}`, 'GRPC', 'GRPC_SERVER');
    });
}
