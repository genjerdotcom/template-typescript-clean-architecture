"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = messages;
const en_1 = __importDefault(require("../../../../shared/constants/messages/validation/en"));
const id_1 = __importDefault(require("../../../../shared/constants/messages/validation/id"));
const messageSources = { en: en_1.default, id: id_1.default };
function messages(lang) {
    return messageSources[lang] || messageSources['en'];
}
