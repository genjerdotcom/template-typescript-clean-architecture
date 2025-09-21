import 'dotenv/config';
import '@app/modules/register.container';
import express, { Application } from "express";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import useragent from 'express-useragent';
import { globalErrorHandler, notFoundHandler, RequestMiddleware } from '@app/presentation/http/middlewares';
import { router } from '@app/presentation/http/routes';
import { logger } from '@app/infrastructure/logger';
import { connectDatabase } from '@app/infrastructure/database';
import { startGrpcServer } from '@app/presentation/grpc/server/grpc.server';

class App {
    public server: Application;

    constructor() {
        this.server = express();
        this.plugins();
        this.databases();
        this.middlewares();
        this.routes();
        this.errorHandlers(); 
    }

    protected plugins(): void {
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));
        this.server.use(morgan("dev"));
        this.server.use(compression());
        this.server.use(helmet());
        this.server.use(useragent.express());
        this.server.use(cors());
    }

    protected middlewares(): void {
        this.server.use(RequestMiddleware);
    }

    private errorHandlers(): void {
        this.server.use(notFoundHandler);
        this.server.use(globalErrorHandler); 
    }
    private routes(): void {
        this.server.use(router);
    }

    private databases(): void {
        connectDatabase();
    }
}

const PORT = process.env.PORT ?? 3000
const server = new App().server
server.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`, 'SERVER', 'SERVER_LISTENING');
});

startGrpcServer();
