import { Request, Response, NextFunction } from "express";
import { logger } from "@app/infrastructure/logger";
import { langContext } from '@app/shared/utils/langcontext.util';
import { v4 as uuidv4 } from 'uuid';

export default function RequestMiddleware(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers['request-id'] ?? uuidv4();
    const acceptLanguage = req.headers['accept-language'];
    const locale = (acceptLanguage?.split(',')[0] ?? 'en').toLowerCase();

    res.locals.locale = 'en'; 
    if (locale === 'id' || locale === 'en') res.locals.locale = locale;
    langContext.setLang(locale);

    req.headers['request-id'] = requestId;
    res.locals.requestId = requestId;

    const logData = {
        requestId: requestId.toString(),
        user: res.locals.user,
        lang: locale,
        headers: req.headers,
        method: req.method,
        originalUrl: req.originalUrl,
        query: JSON.stringify(req.query),
        body: req.body,
    };

    logger.startRequest(logData);
    next();
}
