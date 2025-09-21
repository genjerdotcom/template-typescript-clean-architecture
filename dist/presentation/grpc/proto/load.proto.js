"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadProto = loadProto;
const path_1 = __importDefault(require("path"));
const grpc_js_1 = require("@grpc/grpc-js");
const protoLoader = __importStar(require("@grpc/proto-loader"));
const errors_1 = require("../../../shared/errors");
function loadProto(serviceName, moduleName) {
    const protoPath = path_1.default.resolve(__dirname, `../../../modules/${moduleName.toLowerCase()}/domain/${moduleName.toLowerCase()}.proto`);
    const packageDefinition = protoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    const loaded = (0, grpc_js_1.loadPackageDefinition)(packageDefinition);
    const packageName = moduleName.toLowerCase();
    const module = loaded[packageName];
    if (!module || typeof module !== 'object') {
        throw new errors_1.InternalError.UnknownError('Invalid or missing gRPC module for package', { packageName });
    }
    const ServiceClient = module[serviceName];
    if (!ServiceClient ||
        typeof ServiceClient !== 'function' ||
        !('service' in ServiceClient)) {
        throw new errors_1.InternalError.UnknownError('Service definition not found for module', { moduleName });
    }
    return ServiceClient.service;
}
