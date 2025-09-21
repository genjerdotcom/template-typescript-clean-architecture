"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCreateController = void 0;
const tsyringe_1 = require("tsyringe");
const create_usecase_1 = require("../../../modules/product/usecases/create.usecase");
const dtos_1 = require("../../../modules/product/dtos");
const class_transformer_1 = require("class-transformer");
const responses_1 = require("../../../presentation/grpc/responses");
const product_transform_1 = require("../transformers/product.transform");
let ProductCreateController = class ProductCreateController {
    constructor(createProductUseCase) {
        this.createProductUseCase = createProductUseCase;
    }
    async handle(call, callback) {
        const dto = (0, class_transformer_1.plainToInstance)(dtos_1.CreateProductDto, call.request);
        const result = await this.createProductUseCase.execute(dto);
        const transform = product_transform_1.ProductTransformer.transform(result);
        return responses_1.GrpcResponse.created(callback, 'Product created successfully', transform);
    }
};
exports.ProductCreateController = ProductCreateController;
exports.ProductCreateController = ProductCreateController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('CreateProductUseCase')),
    __metadata("design:paramtypes", [create_usecase_1.CreateProductUseCase])
], ProductCreateController);
