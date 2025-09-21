"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserDto = exports.UpdateUserDto = exports.DetailUserDto = exports.GetUserDto = exports.CreateUserDto = void 0;
const create_dto_1 = __importDefault(require("../../../modules/user/dtos/create.dto"));
exports.CreateUserDto = create_dto_1.default;
const get_dto_1 = __importDefault(require("../../../modules/user/dtos/get.dto"));
exports.GetUserDto = get_dto_1.default;
const detail_dto_1 = __importDefault(require("../../../modules/user/dtos/detail.dto"));
exports.DetailUserDto = detail_dto_1.default;
const update_dto_1 = __importDefault(require("../../../modules/user/dtos/update.dto"));
exports.UpdateUserDto = update_dto_1.default;
const delete_dto_1 = __importDefault(require("../../../modules/user/dtos/delete.dto"));
exports.DeleteUserDto = delete_dto_1.default;
