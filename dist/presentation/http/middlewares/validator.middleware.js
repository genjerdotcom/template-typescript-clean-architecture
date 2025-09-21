"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateRequest;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const responses_1 = require("../../../presentation/http/responses");
function validateRequest(DtoClass) {
    return async (req, res, next) => {
        const merged = {
            ...req.params,
            ...req.query,
            ...req.body,
        };
        const dtoObject = (0, class_transformer_1.plainToInstance)(DtoClass, merged);
        const errors = await (0, class_validator_1.validate)(dtoObject, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        if (errors.length > 0) {
            const errorResults = errors.map(({ property, constraints }) => ({
                property,
                constraints,
            }));
            return responses_1.HttpResponse.badRequest(res, { errors: errorResults });
        }
        next();
    };
}
