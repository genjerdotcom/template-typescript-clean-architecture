"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./modules/register.container");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const middlewares_1 = require("./presentation/http/middlewares");
const routes_1 = require("./presentation/http/routes");
const logger_1 = require("./infrastructure/logger");
const database_1 = require("./infrastructure/database");
const grpc_server_1 = require("./presentation/grpc/server/grpc.server");
class App {
    constructor() {
        this.server = (0, express_1.default)();
        this.plugins();
        this.databases();
        this.middlewares();
        this.routes();
        this.errorHandlers();
    }
    plugins() {
        this.server.use(express_1.default.json());
        this.server.use(express_1.default.urlencoded({ extended: true }));
        this.server.use((0, morgan_1.default)("dev"));
        this.server.use((0, compression_1.default)());
        this.server.use((0, helmet_1.default)());
        this.server.use(express_useragent_1.default.express());
        this.server.use((0, cors_1.default)());
    }
    middlewares() {
        this.server.use(middlewares_1.RequestMiddleware);
    }
    errorHandlers() {
        this.server.use(middlewares_1.notFoundHandler);
        this.server.use(middlewares_1.globalErrorHandler);
    }
    routes() {
        this.server.use(routes_1.router);
    }
    databases() {
        (0, database_1.connectDatabase)();
    }
}
const PORT = process.env.PORT ?? 3000;
const server = new App().server;
server.listen(PORT, () => {
    logger_1.logger.info(`Listening on port ${PORT}`, 'SERVER', 'SERVER_LISTENING');
});
(0, grpc_server_1.startGrpcServer)();
