"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const database_1 = require("../../../infrastructure/database");
exports.ProductModel = (0, database_1.CreateModel)('product', {
    code: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
}, { timestamps: true }, [
    {
        fields: { code: 1, name: 1 },
        options: { unique: true, name: 'code_name_unique' },
    },
]);
