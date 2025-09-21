"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const winston_transport_sentry_node_1 = __importDefault(require("winston-transport-sentry-node"));
const profiling_node_1 = require("@sentry/profiling-node");
const format_1 = require("../../../infrastructure/logger/winston/format");
const logger = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Stream({
            stream: process.stderr,
            level: 'debug',
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.printf((info) => `${new Date().toISOString()} [${info.level}]: ${JSON.stringify({ ...info, level: info[Symbol.for('level')] }, null, 4)}\n`), winston_1.format.timestamp({
                format: 'yyyy-mm-ddThh:mm:ss',
            })),
        }),
    ],
    exitOnError: false,
});
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston_transport_sentry_node_1.default({
        sentry: {
            dsn: process.env.SENTRY_DSN,
            tracesSampleRate: 1.0,
            profilesSampleRate: 1.0,
            integrations: [
                (0, profiling_node_1.nodeProfilingIntegration)(),
            ],
            _experiments: {
                metricsAggregator: true,
            },
        },
        format: (0, format_1.sentryFormat)()
    }));
}
exports.default = logger;
