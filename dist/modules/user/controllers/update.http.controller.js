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
exports.UserUpdateController = void 0;
const responses_1 = require("../../../shared/responses");
const dtos_1 = require("../../../modules/user/dtos");
const usecases_1 = require("../../../modules/user/usecases");
const tsyringe_1 = require("tsyringe");
const class_transformer_1 = require("class-transformer");
let UserUpdateController = class UserUpdateController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase;
    }
    async handle(req, res) {
        const data = (0, class_transformer_1.plainToClass)(dtos_1.UpdateUserDto, { ...req.body, ...req.params });
        const result = await this.updateUserUseCase.execute(data);
        return responses_1.HttpResponse.created(res, 'success', result);
    }
};
exports.UserUpdateController = UserUpdateController;
exports.UserUpdateController = UserUpdateController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('UpdateUserUseCase')),
    __metadata("design:paramtypes", [usecases_1.UpdateUserUseCase])
], UserUpdateController);
