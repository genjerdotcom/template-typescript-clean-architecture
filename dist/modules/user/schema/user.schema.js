"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../../../infrastructure/database");
exports.UserModel = (0, database_1.CreateModel)('user', {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true }, [
    {
        fields: { email: 1, username: 1 },
        options: { unique: true, name: 'email_username_unique' },
    },
]);
