"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productGrpcHandler = void 0;
const tsyringe_1 = require("tsyringe");
const controllers_1 = require("../../../modules/product/controllers");
const validator_interceptor_1 = require("../../../presentation/grpc/interceptors/validator.interceptor");
const compose_interceptor_1 = require("../../../presentation/grpc/interceptors/compose.interceptor");
const dtos_1 = require("../../../modules/product/dtos");
const productCreateController = tsyringe_1.container.resolve(controllers_1.ProductCreateController);
exports.productGrpcHandler = {
    moduleName: 'product',
    serviceName: 'ProductService',
    handlers: {
        CreateProduct: (0, compose_interceptor_1.composeInterceptors)([(0, validator_interceptor_1.grpcValidateRequest)(dtos_1.CreateProductDto)], productCreateController.handle.bind(productCreateController)),
    },
};
