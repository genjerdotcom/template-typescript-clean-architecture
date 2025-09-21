class LangContext {
    private static instance: LangContext;
    private lang: string = 'en';

    public static getInstance(): LangContext {
        if (!LangContext.instance) {
            LangContext.instance = new LangContext();
        }
        return LangContext.instance;
    }

    public setLang(lang: string) {
        this.lang = lang;
    }

    public getLang(): string {
        return this.lang;
    }
}

export const langContext = LangContext.getInstance();