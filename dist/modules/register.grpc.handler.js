"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcHandlerGroups = void 0;
const product_grpc_handler_1 = require("../modules/product/handlers/product.grpc.handler");
exports.grpcHandlerGroups = [
    product_grpc_handler_1.productGrpcHandler,
];
