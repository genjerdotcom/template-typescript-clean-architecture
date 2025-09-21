import { langContext } from '@app/shared/utils/langcontext.util';

describe('LangContext', () => {
    afterEach(() => {
        langContext.setLang('en');
    });

    it('should return default language as "en"', () => {
        expect(langContext.getLang()).toBe('en');
    });

    it('should update the language using setLang', () => {
        langContext.setLang('id');
        expect(langContext.getLang()).toBe('id');
    });

    it('should be a singleton (same instance)', () => {
        const instance1 = langContext;
        const instance2 = langContext;

        instance1.setLang('fr');
        expect(instance2.getLang()).toBe('fr');
        expect(instance1).toBe(instance2);
    });
});
