"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const langcontext_util_1 = require("../../../shared/utils/langcontext.util");
describe('LangContext', () => {
    afterEach(() => {
        langcontext_util_1.langContext.setLang('en');
    });
    it('should return default language as "en"', () => {
        expect(langcontext_util_1.langContext.getLang()).toBe('en');
    });
    it('should update the language using setLang', () => {
        langcontext_util_1.langContext.setLang('id');
        expect(langcontext_util_1.langContext.getLang()).toBe('id');
    });
    it('should be a singleton (same instance)', () => {
        const instance1 = langcontext_util_1.langContext;
        const instance2 = langcontext_util_1.langContext;
        instance1.setLang('fr');
        expect(instance2.getLang()).toBe('fr');
        expect(instance1).toBe(instance2);
    });
});
