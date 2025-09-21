"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RequestMiddleware;
const logger_1 = require("../../../infrastructure/logger");
const langcontext_util_1 = require("../../../shared/utils/langcontext.util");
const uuid_1 = require("uuid");
function RequestMiddleware(req, res, next) {
    const requestId = req.headers['request-id'] ?? (0, uuid_1.v4)();
    const acceptLanguage = req.headers['accept-language'];
    const locale = (acceptLanguage?.split(',')[0] ?? 'en').toLowerCase();
    res.locals.locale = 'en';
    if (locale === 'id' || locale === 'en')
        res.locals.locale = locale;
    langcontext_util_1.langContext.setLang(locale);
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
    logger_1.logger.startRequest(logData);
    next();
}
