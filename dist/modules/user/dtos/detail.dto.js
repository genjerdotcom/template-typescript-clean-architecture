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
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../../../shared/constants/messages/validation");
const utils_1 = require("../../../shared/utils");
const class_validator_1 = require("class-validator");
class DetailUserDto {
}
exports.default = DetailUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({
        message: () => (0, utils_1.translateMessage)((0, validation_1.messages)(utils_1.langContext.getLang()), 'isNotEmpty', {})
    }),
    (0, class_validator_1.Matches)(/^[0-9a-fA-F]{24}$/, {
        message: () => (0, utils_1.translateMessage)((0, validation_1.messages)(utils_1.langContext.getLang()), 'invalidMongoId', {}),
    }),
    __metadata("design:type", String)
], DetailUserDto.prototype, "id", void 0);
