"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger_1 = require("../../infrastructure/logger/winston/logger");
exports.logger = new logger_1.WinstonLogger();
