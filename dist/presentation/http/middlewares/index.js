"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.RequestMiddleware = exports.notFoundHandler = exports.globalErrorHandler = void 0;
const error_middleware_1 = require("../../../presentation/http/middlewares/error.middleware");
Object.defineProperty(exports, "globalErrorHandler", { enumerable: true, get: function () { return error_middleware_1.globalErrorHandler; } });
Object.defineProperty(exports, "notFoundHandler", { enumerable: true, get: function () { return error_middleware_1.notFoundHandler; } });
const request_middleware_1 = __importDefault(require("../../../presentation/http/middlewares/request.middleware"));
exports.RequestMiddleware = request_middleware_1.default;
const validator_middleware_1 = __importDefault(require("../../../presentation/http/middlewares/validator.middleware"));
exports.validateRequest = validator_middleware_1.default;
