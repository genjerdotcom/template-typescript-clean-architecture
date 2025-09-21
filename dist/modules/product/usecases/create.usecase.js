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
exports.CreateProductUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const product_repository_1 = require("../../../modules/product/repositories/product.repository");
const base_transaction_1 = require("../../../infrastructure/database/mongodb/base.transaction");
let CreateProductUseCase = class CreateProductUseCase {
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async execute(dto) {
        const result = await (0, base_transaction_1.runInTransaction)(async (session) => {
            return this.productRepo.create({
                code: dto.code,
                name: dto.name,
                price: dto.price
            }, session);
        });
        return result;
    }
};
exports.CreateProductUseCase = CreateProductUseCase;
exports.CreateProductUseCase = CreateProductUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ProductRepository')),
    __metadata("design:paramtypes", [product_repository_1.ProductRepository])
], CreateProductUseCase);
