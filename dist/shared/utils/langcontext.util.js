"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.langContext = void 0;
class LangContext {
    constructor() {
        this.lang = 'en';
    }
    static getInstance() {
        if (!LangContext.instance) {
            LangContext.instance = new LangContext();
        }
        return LangContext.instance;
    }
    setLang(lang) {
        this.lang = lang;
    }
    getLang() {
        return this.lang;
    }
}
exports.langContext = LangContext.getInstance();
