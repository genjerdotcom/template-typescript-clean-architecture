import { createLogger, format, transports } from "winston";
import Sentry from "winston-transport-sentry-node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { sentryFormat } from "@app/infrastructure/logger/winston/format";

const logger = createLogger({
    transports: [
        new transports.Stream({
            stream: process.stderr,
            level: 'debug',
            format: format.combine(
                format.colorize(),
                format.printf(
                    (info) => `${new Date().toISOString()} [${
                        info.level
                    }]: ${JSON.stringify({ ...info, level: info[Symbol.for('level')] }, null, 4)}\n`,
                ),
                format.timestamp({
                    format: 'yyyy-mm-ddThh:mm:ss',
                }),
            ),
        }),
    ],
    exitOnError: false,
});

if (
    process.env.NODE_ENV === 'production'
) {
    logger.add(
        new Sentry({
            sentry: {
                dsn: process.env.SENTRY_DSN,
                tracesSampleRate: 1.0,
                profilesSampleRate: 1.0,
                integrations: [
                    nodeProfilingIntegration(),
                ],
                _experiments: {
                    metricsAggregator: true,
                },
            },
            format: sentryFormat()
        })
    );
}

export default logger;