"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sentryFormat = void 0;
const winston_1 = require("winston");
const lodash_1 = __importDefault(require("lodash"));
const sentryFormat = (0, winston_1.format)((info) => {
    const { path, requestId, ...extra } = info;
    info = {
        ...extra,
        message: info.message
            ? `${lodash_1.default.capitalize(info.level)}: ${JSON.stringify(info.message)}`
            : `${lodash_1.default.capitalize(info.level)}: INFO`,
        tags: {
            path: path ?? '',
            request_id: requestId ?? '',
        },
        level: info.level
    };
    return info;
});
exports.sentryFormat = sentryFormat;
