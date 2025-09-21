"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateMessage = translateMessage;
function translateMessage(source, key, params = {}) {
    const template = source[key] || source['default'] || 'Validation failed';
    return template.replace(/\$\{(\w+)\}/g, (_, k) => String(params[k] ?? ''));
}
